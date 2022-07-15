const asyncHandler = require("../middlewares/asyncHandler");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @date      2022-06-22
 * @desc      Create post
 * @route     POST /api/v1/posts
 * @access    Private
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  req.body.ownerId = connectedUser.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});
