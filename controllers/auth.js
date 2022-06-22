const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  let user = await User.findOne({ username });

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
