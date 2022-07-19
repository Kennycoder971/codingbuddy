const asyncHandler = require("../middlewares/asyncHandler");
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @date      2022-06-22
 * @desc      Get all replies
 * @desc      Get all replies for a post
 * @route     GET /api/v1/posts/:postId/replies
 * @route     GET /api/v1/replies
 * @access    Private
 */
exports.getReplies = asyncHandler(async (req, res, next) => {
  if (req.params.postId) {
    const replies = await Reply.find({ replyTo: req.params.postId });

    return res.status(200).json({
      success: true,
      count: replies.length,
      data: replies,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @date      2022-06-22
 * @desc      Get a reply by id
 * @route     GET /api/v1/replies/:id
 * @access    Public
 */
exports.getReplyById = asyncHandler(async (req, res, next) => {
  const reply = await Reply.findById(req.params.id);

  if (!reply) {
    return next(new ErrorResponse("Cette réponse n'existe pas"), 404);
  }

  console.log(req.params.id);
  return res.status(200).json({
    success: true,
    data: reply,
  });
});

/**
 * @date      2022-06-22
 * @desc      Create reply to a post
 * @route     POST /api/v1/posts/:postId/replies
 * @access    Private
 */

exports.createReplyToPost = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse("Ce post n'existe pas"), 404);
  }

  // Fill required fields for reply
  req.body.replyTo = post.id;
  req.body.owner = connectedUser.id;

  const reply = await Reply.create(req.body);

  // Add reply id to post replies array
  post.replies.push(reply.id);

  // Create reply Chain (see Reply Model) (ids only)
  reply.replyChain.push(post.id, reply.id);

  // Save all
  await Promise.all([post.save(), reply.save()]);

  res.status(201).json({
    success: true,
    data: reply,
  });
});

/**
 * @date      2022-06-22
 * @desc      Update reply to a by id
 * @route     PUT /api/v1/replies/:id
 * @access    Private
 */
exports.updateReply = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  let reply = await Reply.findById(req.params.id);

  if (!reply) {
    return next(new ErrorResponse("Cette réponse n'existe pas"), 404);
  }

  if (connectedUser.id.toString() !== reply.owner.toString()) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cette réponse"),
      403
    );
  }

  reply = await Reply.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: reply,
  });
});

/**
 * @date      2022-06-22
 * @desc      Delete reply to a by id
 * @route     DELETE /api/v1/replies/:id
 * @access    Private
 */
exports.deleteReply = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  let reply = await Reply.findById(req.params.id);

  if (!reply) {
    return next(new ErrorResponse("Cette réponse n'existe pas"), 404);
  }

  if (connectedUser.id.toString() !== reply.owner.toString()) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à supprimer cette réponse"),
      403
    );
  }

  await Reply.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: {},
  });
});

/**
 * @date      2022-06-22
 * @desc      Reply to a reply
 * @route     POST /api/v1/replies/:replyId/re-reply
 * @access    Private
 */

exports.addReplyToReply = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;

  let firstReply = await Reply.findById(req.params.replyId);

  if (!firstReply) {
    return next(new ErrorResponse("Cette réponse n'existe pas"), 404);
  }

  // Fill required fields for new reply
  req.body.replyTo = firstReply.id;
  req.body.owner = connectedUser.id;

  const newReply = await Reply.create(req.body);

  // Add a reply to the firstReply array
  firstReply.replies.push(newReply.id);

  // Add a reply chain to the newReply which is a copy of the
  // firstReply reply chain + the new reply id (ids only)
  newReply.replyChain.push(...firstReply.replyChain, newReply.id);

  // Save all
  await Promise.all([firstReply.save(), newReply.save()]);

  res.status(201).json({
    success: true,
    data: newReply,
  });
});
