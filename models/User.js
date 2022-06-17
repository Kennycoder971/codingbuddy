const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Veuillez ajouter un nom d'utilisateur"],
    unique: [true, "Ce nom d'utilisateur existe déjà"],
  },
  firstname: {
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
    type: Array,
  },
  reposts: {
    type: Array,
  },
  following: {
    type: Array,
  },
  followers: {
    type: Array,
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

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
