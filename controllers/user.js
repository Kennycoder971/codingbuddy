const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.createUser = asyncHandler(async (req, res, next) => {
  // Check if username aleady exists
  let user;
  const { username, email } = req.body;

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
