const express = require("express");
const { getLikes, createLike } = require("../controllers/like");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResults");
const Like = require("../models/Like");

router.route("/").get(advancedResults(Like), getLikes).post(createLike);

router.route("/:id");

module.exports = router;
