const mongoose = require("mongoose");

const HashTagSchema = new mongoose.Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hashtag", HashTagSchema);
