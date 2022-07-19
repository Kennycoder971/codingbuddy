const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Veuillez ajouter un nom d'utilisateur"],
    unique: [true, "Ce nom d'utilisateur existe déjà"],
    trim: true,
  },
  firstname: {
    type: String,
  },
  slug: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Veuillez ajouter un email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Veuillez ajouter un email valide",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, "Veuillez ajouter un mot de passe "],
    minlength: [6, "Le mot de passe doit contenir au moins 6 charactères"],
    select: false,
  },
  profilePicture: String,
  backgroundPicture: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  bio: String,
  saves: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  reposts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  this.slug = slugify(this.username);
  next();
});

// Sign JWT and return it
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
