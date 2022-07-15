const express = require("express");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/post");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResults");
const Post = require("../models/Post");

router.use(protect);

router
  .route("/")
  .get(
    advancedResults(Post, {
      path: "owner",
      select: "username",
    }),
    getPosts
  )
  .post(authorize("user", "admin"), createPost);

router.route("/:id").put(updatePost).delete(deletePost);

module.exports = router;
