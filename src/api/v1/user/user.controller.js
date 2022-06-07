const express = require("express");
const userService = require("./user.service");
const {
  verifyAndExtractTokenDetails,
} = require("../../../services/jwt.service");

const router = express();

router.route("/").get(verifyAndExtractTokenDetails, userService.getUser);

router.route("/register").post(userService.registerUser);

module.exports = router;