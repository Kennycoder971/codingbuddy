const asyncHandler = require("../middlewares/asyncHandler");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get posts
// @route     GET /api/v1/posts
// @route     GET /api/v1/users/:-/posts
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const posts = await Post.find({ ownerId: req.params.userId });

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @date      2022-06-22
 * @desc      Create post
 * @route     POST /api/v1/posts
 * @access    Private
 */
exports.createPost = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  req.body.owner = connectedUser.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});
