const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  image: String,
  likes: Array,
  text: {
    type: String,
    required: [true, "Veuillez ajouter du texte"],
    maxlength: [777, "La limite est de 777 charactères"],
  },
  ownerId: mongoose.Types.ObjectId,
  hashtags: Array,
  replies: Array,
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
