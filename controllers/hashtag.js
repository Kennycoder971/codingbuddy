const asyncHandler = require("../middlewares/asyncHandler");
const Hashtag = require("../models/Hashtag");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");
const slugify = require("slugify");

/**
 * @date      2022-06-22
 * @desc      Get all hashtags
 * @route     GET /api/v1/hashtags
 * @access    Public
 */
exports.getHashtags = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @date      2022-06-22
 * @desc      Get a hashtag by slug
 * @route     GET /api/v1/hashtags/:slug
 * @access    Public
 */
exports.getHashtagsBySlug = asyncHandler(async (req, res, next) => {
  const slug = slugify(req.params.slug);
  const hashtag = await Hashtag.findOne({ slug });

  res.status(200).json({
    success: true,
    data: hashtag,
  });
});

/**
 * @date      2022-06-22
 * @desc      Create a hashtags with a post id
 * @route     POST /api/v1/posts/:postId/hashtags
 * @access    Private
 */
exports.createHashtag = asyncHandler(async (req, res, next) => {
  const hashtagToCreate = req.body.hashtag;
  const hashtagSlug = slugify(hashtagToCreate);
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse("Ce post n'existe pas"), 404);
  }

  // Check if the post already has the hashtag to create
  const isHashtagExistsInPost = post.hashtags.some((hashtag) => {
    return hashtag === hashtagToCreate;
  });

  if (!isHashtagExistsInPost) {
    post.hashtags.push(hashtagToCreate);
    await post.save();
  }

  // Check if a hashtag with the slug already exists
  let hashtag = await Hashtag.findOne({ slug: hashtagSlug });

  // If the hashtag already exists add postId to the hashtag posts array
  if (hashtag) {
    // Check if hashtag already has postId in it
    const isPostExistsInHashtag = hashtag.posts.some((postId) => {
      return postId.toString() === post.id.toString();
    });

    if (!isPostExistsInHashtag) {
      hashtag.posts.push(post.id);
      await hashtag.save();
    }

    return res.status(200).json({ success: true, data: hashtag });
  }

  // Otherwise create a new hashtag
  // The slug is created before save
  hashtag = await Hashtag.create({ text: hashtagToCreate });

  hashtag.posts.push(post.id);
  await hashtag.save();

  res.status(201).json({ success: true, data: hashtag });
});
