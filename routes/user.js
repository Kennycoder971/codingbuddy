const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const router = express.Router();

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("admin", "user"), updateUser)
  .delete(protect, authorize("admin", "user"), deleteUser);

module.exports = router;
