const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middlewares/advancedResults");
const { protect } = require("../middlewares/auth");
const postRouter = require("./post");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
  userCoverUpload,
  save,
  unsave,
  addFollow,
} = require("../controllers/user");
const router = express.Router();

// Re-route into other resource routers
router.use("/:userId/posts", postRouter);

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

router.route("/:id/save").put(protect, save).delete(protect, unsave);
router.route("/:id/follow").put(protect, addFollow).delete(protect);

router.route("/:id/photo").put(protect, userPhotoUpload);
router.route("/:id/cover").put(protect, userCoverUpload);

module.exports = router;
