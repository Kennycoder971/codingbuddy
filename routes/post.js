const express = require("express");
const { createPost } = require("../controllers/post");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.use(protect);

router.route("/").post(createPost);

module.exports = router;
