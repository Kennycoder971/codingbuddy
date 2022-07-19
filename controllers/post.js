const asyncHandler = require("../middlewares/asyncHandler");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get posts
// @route     GET /api/v1/posts
// @route     GET /api/v1/users/:userId/posts
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

/**
 * @date      2022-06-22
 * @desc      Update post
 * @route     PUT /api/v1/posts/:id
 * @access    Private
 */
exports.updatePost = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Ce post n'existe pas"), 404);
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (connectedUser.id.toString() !== post.owner.toString()) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier ce post"),
      403
    );
  }
  res.status(201).json({
    success: true,
    data: post,
  });
});

/**
 * @date      2022-06-22
 * @desc      Update post
 * @route     DELETE /api/v1/posts/:id
 * @access    Private
 */
exports.deletePost = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse("Ce post n'existe pas"), 400);
  }

  post = await Post.findByIdAndDelete(req.params.id);

  if (connectedUser.id.toString() !== post.owner.toString()) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à supprimer ce post"),
      403
    );
  }
  res.status(201).json({
    success: true,
    data: {},
  });
});
