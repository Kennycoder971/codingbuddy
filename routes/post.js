const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResults");

const replyRouter = require("./reply");
const likeRouter = require("./like");
const hashtagRouter = require("./hashtag");

const Post = require("../models/Post");

// Re-route into other resource routers
router.use("/:postId/replies", replyRouter);
router.use("/:postId/likes", likeRouter);
router.use("/:postId/hashtags", hashtagRouter);

router
  .route("/")
  .get(
    advancedResults(Post, {
      path: "owner",
      select: "username",
    }),
    getPosts
  )
  .post(protect, authorize("user", "admin"), createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
