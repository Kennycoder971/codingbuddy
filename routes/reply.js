const express = require("express");
const { createReplyToPost } = require("../controllers/reply");
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
    })
  )
  .post(authorize("user", "admin"), createReplyToPost);

module.exports = router;
