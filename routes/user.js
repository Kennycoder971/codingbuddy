const express = require("express");
const { createUser } = require("../controllers/user");
const router = express.Router();

router.route("/").get(createUser);

module.exports = router;
