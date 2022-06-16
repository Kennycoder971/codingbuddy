const mongoose = require("mongoose");

const Like = new mongoose.Schema({
  ownerId: mongoose.Types.ObjectId,
  likeTo: mongoose.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", Like);
