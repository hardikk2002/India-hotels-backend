const mongoose = require("mongoose");
const postRepository = require("../../../database/mongo/repositories/posts.repository");

const isHotelOwner = async (email) => {
  const isOwner = await postRepository.postValidationByCriteria({
    $and: [
      {
        email,
      },
      {
        userType: "hotelowner",
      },
    ],
  });
  if (!isOwner.length) {
    throw new Error("User doesn't have hotel owner rights.");
  }
};

const checkIfAlreadyPostExists = async (postObj) => {
  const postAlreadyExists = await postRepository.postValidationByCriteria({
    $and: [
      {
        email: postObj.email,
      },
      {
        postbio: postObj.postbio,
      },
      {
        title: postObj.title,
      },
    ],
  });

  if (postAlreadyExists.length > 0) {
    throw new Error("Hotel with same details already exists under your name.");
  }
};

const postValidation = async (postObj) => {
  await isHotelOwner(postObj.email);
  await checkIfAlreadyPostExists(postObj);
};

module.exports.getPosts = async (req, res) => {
  try {
    res.status(200).json(await postRepository.getPosts());
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.createPosts = async (req, res) => {
  try {
    const postObj = req.body;
    postObj.email = req.user.email;

    await postValidation(postObj);

    const createPostRes = await postRepository.createPost({
      ...postObj,
      creator: postObj.email,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(createPostRes);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports.updatePosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "Invalid post id" });

    isHotelOwner(email);

    res.status(200).json(await postRepository.updatePostById(id, req.body));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.searchPosts = async (req, res) => {
  try {
    const searchObj = req.body;
    // console.log(searchObj);
    const searchPostRes = await postRepository.searchPost({
      $or: [
        {
          title: { $regex: searchObj.query, $options: "i" },
        },
        {
          postbio: { $regex: searchObj.query, $options: "i" },
        },
        {
          "address.city": { $regex: searchObj.query, $options: "i" },
        },
      ],
    });
    res.status(200).json(searchPostRes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.upvotePosts = async (req, res) => {
  // post ID user wants to like
  const { id } = req.params;

  if (!req.user) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Invalid post id" });

  try {
    const post = await postRepository.getPostById(id);
    // console.log(post);
    const index = post.likes.findIndex(
      (email) => email === String(req.user?.email)
    );

    if (index === -1) {
      // Upvote
      post.likes.push(req.user.email);
    } else {
      // Down vote
      post.likes = post.likes.filter(
        (email) => email !== String(req.user?.email)
      );
    }

    res.status(200).json(await postRepository.updatePostById(id, post));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  // const post;
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json("Invalid post id");

    const { creator } = await postRepository.getPostById(id);
    if (creator !== email)
      throw new Error("User don't have permissions to delete this post");

    await postRepository.deletePostById(id);

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getRoomStatus = async (req, res) => {
  try {
    const { email } = req.user;
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(404).json({ message: "Invalid post id" });

    const postObj = await postRepository.getPostById(postId);

    const roomObj = {
      allottedUser: email,
    };

    roomObj.totalRoomCount = postObj.rooms.totalRoomCount;
    roomObj.availableRoomCount = postObj.rooms.availableRoomCount;

    if (email === postObj.creator) {
      roomObj.roomDetails = postObj.rooms.roomDetails;
    }

    res.status(200).json(roomObj);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.updateRoomStatus = async (req, res) => {
  try {
    const { email } = req.user;
    const { status } = req?.params;
    const { id: postId } = req.params;
    const { roomNumber, allottedUser } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(404).json({ message: "Invalid post id" });

    const postObj = await postRepository.getPostById(postId);
    if (email !== postObj.creator)
      return res
        .status(404)
        .json({ message: "Sorry you don't have permissions" });

    if (status === "book") {
      if (postObj.rooms.roomDetails.findIndex((a) => a.id === roomNumber)) {
        return res
          .status(404)
          .json({ message: `Room ${roomNumber} is already in use.` });
      }
      postObj.rooms.availableRoomCount--;
      postObj.rooms.roomDetails.push({
        roomNumber: roomNumber,
        allottedUser: allottedUser,
      });
    } else {
      postObj.rooms.availableRoomCount++;
      postObj.rooms.roomDetails.splice(
        postObj.rooms.roomDetails.findIndex((a) => a.id === roomNumber),
        1
      );
    }

    res.status(200).json(await postRepository.updatePostById(postId, postObj));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
