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
      count: post.likes.length || 0,
      data: post.likes || [],
    });
  }

  if (req.params.replyId) {
    const reply = await Reply.find({ id: req.params.replyId });

    return res.status(200).json({
      success: true,
      count: reply.likes.length || 0,
      data: reply.likes || [],
    });
  }

  res.status(200).json(res.advancedResults);
});

// @desc      Create a Like for a post or a reply
// @route     POST /api/v1/post/postId/likes
// @route     POST /api/v1/reply/replyId/likes
// @access    Private
exports.createLike = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  // Fill required field for like
  req.body.owner = connectedUser.id;

  if (req.params.postId) {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(new ErrorResponse("Le post n'existe pas.", 404));
    }

    let like;

    // Fill required field for like
    req.body.likeTo = post.id;

    // Check if the user has already liked this post
    // If not add a like to it
    like = await Like.findOne({ owner: connectedUser.id, likeTo: post.id });
    if (!like) {
      like = await Like.create(req.body);
      post.likes.push(like.owner);
      await post.save();
    }

    return res.status(201).json({
      success: true,
      data: post.likes,
    });
  } else if (req.params.replyId) {
    const reply = await Reply.findById(req.params.replyId);
    console.log("TRIGGERED");
    console.log(reply);

    if (!reply) {
      return next(new ErrorResponse("La réponse n'existe pas.", 404));
    }

    let like;

    // Fill required fields for like
    req.body.likeTo = reply.id;

    // Check if the user has already liked this reply
    // If not add a like to it
    like = await Like.findOne({ owner: connectedUser.id, likeTo: reply.id });
    if (!like) {
      like = await Like.create(req.body);
      reply.likes.push(like.owner);
      await reply.save();
    }

    return res.status(201).json({
      success: true,
      data: reply.likes,
    });
  } else {
    return next(new ErrorResponse("le post ou la réponse n'existe pas.", 404));
  }
});

// @desc      Delete Likes
// @route     DELETE /api/v1/posts/:postId/likes
// @route     DELETE /api/v1/replies/:replyId/likes
// @access    Public
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  if (req.params.postId) {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(new ErrorResponse("Ce post n'existe pas."), 403);
    }

    const like = await Like.findOne({
      owner: connectedUser.id,
      likeTo: post.id,
    });

    if (!like) {
      return next(
        new ErrorResponse("Vous n'avez pas ajouté de like pour ce post"),
        400
      );
    }

    if (like.owner.toString() !== connectedUser.id.toString()) {
      return next(
        new ErrorResponse("Vous n'êtes pas autorisé à supprimer ce like"),
        403
      );
    }

    await like.delete();
    await post.update({ $pull: { likes: connectedUser.id } });

    return res.status(200).json({
      success: true,
      data: {},
    });
  }

  if (req.params.replyId) {
    const reply = await Reply.findById(req.params.replyId);

    if (!reply) {
      return next(new ErrorResponse("Ce reply n'existe pas."), 403);
    }

    const like = await Like.findOne({
      owner: connectedUser.id,
      likeTo: reply.id,
    });

    if (!like) {
      return next(
        new ErrorResponse("Vous n'avez pas ajouté de like pour cette réponse"),
        400
      );
    }

    if (like.owner.toString() !== connectedUser.id.toString()) {
      return next(
        new ErrorResponse("Vous n'êtes pas autorisé à supprimer ce like"),
        403
      );
    }

    await like.delete();
    await reply.update({ $pull: { likes: connectedUser.id } });

    return res.status(200).json({
      success: true,
      data: {},
    });
  }

  next();
});
