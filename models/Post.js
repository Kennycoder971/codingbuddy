const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  text: {
    type: String,
    required: [true, "Veuillez ajouter du texte"],
    maxlength: [777, "La limite est de 777 charactères"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hashtags: [String],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
