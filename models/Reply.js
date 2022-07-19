const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
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
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // To know the reply chain
  // A post can have a reply. This reply can have other replies and so on.
  // Post <= Reply (to post or replyTo in model) <= Reply (to 1st reply) <= Reply (to 2nd reply)
  // Post <= Reply <= Reply <= Reply
  // [Post, Reply, Reply, Reply]
  replyChain: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model("Reply", ReplySchema);
