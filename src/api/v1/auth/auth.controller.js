const express = require("express");
const router = express();

const authService = require("./auth.service");

router.route("/login")
.post(authService.authenticateUser);
// .get();

module.exports = router;