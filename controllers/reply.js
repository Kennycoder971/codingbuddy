const asyncHandler = require("../middlewares/asyncHandler");
const Post = require("../models/Post");
const Reply = require("../models/Reply");
const ErrorResponse = require("../utils/errorResponse");

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

  req.body.replyTo = post.id;
  req.body.owner = connectedUser.id;

  const reply = await Reply.create(req.body);

  // Add reply id to post replies array and save
  post.replies.push(reply.id);
  await post.save();

  // Create reply Chain (see Reply Model) and save
  reply.replyChain.push(post.id, reply.id);
  await reply.save();

  res.status(201).json({
    success: true,
    data: reply,
  });
});
