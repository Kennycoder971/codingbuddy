const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

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

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(201).json({
    success: true,
    data: users,
  });
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

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
