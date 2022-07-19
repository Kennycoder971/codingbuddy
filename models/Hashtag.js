const mongoose = require("mongoose");
const slugify = require("slugify");

const HashTagSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add slug before save
HashTagSchema.pre("save", async function (next) {
  this.slug = slugify(this.text.replace("#", ""));
  next();
});

module.exports = mongoose.model("Hashtag", HashTagSchema);
