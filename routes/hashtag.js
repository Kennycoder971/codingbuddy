const express = require("express");
const {
  getHashtags,
  createHashtag,
  getHashtagsBySlug,
} = require("../controllers/hashtag");
const { protect } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResults");

const Hashtag = require("../models/Hashtag");

router
  .route("/")
  .get(advancedResults(Hashtag), getHashtags)
  .post(protect, createHashtag);

router.route("/:slug").get(getHashtagsBySlug);

module.exports = router;
