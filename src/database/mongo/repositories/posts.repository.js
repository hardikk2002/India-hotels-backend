const Post = require("../schemas/Posts.schema");
const User = require("../schemas/Users.schema");

const getPosts = async () => {
  return await Post.find();
};

const createPost = async (postObj) => {
  const newPosts = new Post(postObj);
  return await newPosts.save();
};

const postValidationByCriteria = async (postObj) => {
  const validationCriteria = Object.keys(postObj.$and[1])[0];

  if (validationCriteria === "userType") return await User.find(postObj);
  if (validationCriteria === "postbio") return await Post.find(postObj);
};

const searchPost = async (searchObj) => {
  return await Post.find(searchObj).collation({
    locale: "en",
    strength: 2,
  });
};

const getPostById = async (id) => {
  return await Post.findById(id);
};

const updatePostById = async (id, post) => {
  return await Post.findByIdAndUpdate(id, post, { new: true });
};

const deletePostById = async (id) => {
  return await Post.findByIdAndRemove(id);
};

module.exports = {
  getPosts,
  createPost,
  postValidationByCriteria,
  updatePostById,
  searchPost,
  getPostById,
  deletePostById,
};
