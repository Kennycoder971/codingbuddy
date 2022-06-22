const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @date      2022-06-22
 * @desc      Create user
 * @route     POST /api/v1/users
 * @access    Public
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  let user;
  const { username, email } = req.body;

  // Check if username aleady exists
  user = await User.findOne({ username }, user);

  if (user) {
    return next(new ErrorResponse("Ce nom d'utilisateur est existant"), 400);
  }

  user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse("Cet adresse mail est déjà existante"), 400);
  }

  user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Get users
 * @route     GET /api/v1/users
 * @access    Public
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(201).json(res.advancedResults);
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Update user
 * @route     PUT /api/v1/users
 * @access    Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Register user
 * @route     DELETE /api/v1/users
 * @access    Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
