const express = require("express");
const {
  createReplyToPost,
  getReplies,
  getReplyById,
  updateReply,
  addReplyToReply,
  deleteReply,
} = require("../controllers/reply");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middlewares/advancedResults");

const likeRouter = require("./like");

const Reply = require("../models/Reply");

router.use("/:replyId/likes", likeRouter);

router
  .route("/")
  .get(advancedResults(Reply), getReplies)
  .post(protect, authorize("user", "admin"), createReplyToPost);

router
  .route("/:id")
  .get(getReplyById)
  .put(protect, updateReply)
  .delete(protect, deleteReply);

router.route("/:replyId/re-reply").post(protect, addReplyToReply);

module.exports = router;
