const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new ErrorResponse(
        "Vous n'êtes pas authorisés à accéder à cette route",
        401
      )
    );
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new ErrorResponse(
        "Vous n'êtes pas authorisés à accéder à cette route",
        401
      )
    );
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Un utilisateur avec le rôle :${req.user.role} ne peut pas accéder à cette route route`,
          403
        )
      );
    }
    next();
  };
};
