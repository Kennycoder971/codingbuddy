const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likeTo: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Like", LikeSchema);
