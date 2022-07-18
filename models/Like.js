const mongoose = require("mongoose");

const Like = new mongoose.Schema({
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

module.exports = mongoose.model("Like", Like);
