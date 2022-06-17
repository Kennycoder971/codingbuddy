const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});
