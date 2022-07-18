const asyncHandler = require("../middlewares/asyncHandler");
const Like = require("../models/Like");
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get Likes
// @route     GET /api/v1/likes
// @route     GET /api/v1/posts/:postId/likes
// @route     GET /api/v1/replies/:replyId/likes
// @access    Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  if (req.params.postId) {
    const post = await Post.find({ id: req.params.postId });

    return res.status(200).json({
      success: true,
      count: post.likes.length,
      data: post.likes,
    });
  }

  if (req.params.replyId) {
    const reply = await Reply.find({ id: req.params.replyId });

    return res.status(200).json({
      success: true,
      count: reply.likes.length,
      data: reply.likes,
    });
  }

  res.status(200).json(res.advancedResults);
});

// @desc      Create a Like for a post of a reply
// @route     POST /api/v1/post/postId/likes
// @route     POST /api/v1/reply/replyId/likes
// @access    Private
exports.createLike = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  // Fill required field for like
  req.body.owner = connectedUser.id;

  if (req.params.postId) {
    const post = await Post.find({ id: req.params.postId });

    // Fill required field for like
    req.body.likeTo = post.id;

    const like = await Like.create(req.body);

    post.likes.push(like);

    await post.save();

    return res.status(200).json({
      success: true,
      data: post.like,
    });
  } else if (req.params.replyId) {
    const reply = await Reply.find({ id: req.params.replyId });

    // Fill required fields for like
    req.body.likeTo = reply.id;

    const like = await Like.create(req.body);

    reply.likes.push(like);

    await reply.save();

    return res.status(200).json({
      success: true,
      data: reply.like,
    });
  } else {
    return next(new ErrorResponse("le post ou la réponse n'existe pas.", 400));
  }
});
