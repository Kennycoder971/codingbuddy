const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

/**
 * @date      2022-06-22
 * @desc      Register user
 * @route     GET /api/v1/auth/register
 * @access    Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;
  const slugifiedUsername = slugify(username);

  // Check if slug of the username exists as well
  let user = await User.findOne({
    $or: [{ username }, { slug: slugifiedUsername }],
  });

  if (user) {
    return next(new ErrorResponse("Cet utilisateur existe déjà", 400));
  }

  user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse("Cet email a déjà été utilisé", 400));
  }

  user = await User.create(req.body);

  sendTokenResponse(user, 201, res);
});

/**
 * @date      2022-06-22
 * @desc      Log user in
 * @route     POST /api/v1/auth/login
 * @access    Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  let user;
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  user = await User.findOne({ email }).select("password");

  if (!user) {
    return next(
      new ErrorResponse("l'email ou le mot de passe est incorrect", 401)
    );
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword) {
    return next(
      new ErrorResponse("l'email ou le mot de passe est incorrect", 401)
    );
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @date      2022-06-22
 * @desc      Log user out / clear cookie
 * @route     GET /api/v1/auth/logout
 * @access    Public
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @date      2022-06-22
 * @desc      Get current logged in user
 * @route     GET /api/v1/auth/me
 * @access    Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @date 2022-06-22
 * @desc Get token from model, create cookie and send response
 */

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
