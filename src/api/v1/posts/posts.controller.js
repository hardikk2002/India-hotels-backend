const express = require("express");
const postService = require("./posts.service");
const {
  verifyAndExtractTokenDetails,
} = require("../../../services/jwt.service");

const router = express();

// Get Post Details
router.route("/").get(postService.getPosts);

// Search Post by query
router.route("/").post(postService.searchPosts);

// Create Posts
router
  .route("/create")
  .post(verifyAndExtractTokenDetails, postService.createPosts);

// Update Posts
router
  .route("/:id").put(verifyAndExtractTokenDetails, postService.updatePosts);

// Up-vote and Down-vote Posts
router
  .route("/upvote/:id")
  .patch(verifyAndExtractTokenDetails, postService.upvotePosts);

// Delete Post
router
  .route("/:id")
  .delete(verifyAndExtractTokenDetails, postService.deletePost);

/**
 * Hotel Rooms
 */
// Get Room status
router
  .route("/:id/rooms")
  .get(verifyAndExtractTokenDetails, postService.getRoomStatus);

// Room booking and debooking
router
  .route("/:id/rooms/:status")
  .put(verifyAndExtractTokenDetails, postService.updateRoomStatus);

module.exports = router;
