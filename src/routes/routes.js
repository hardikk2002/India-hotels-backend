const express = require("express");
const app = express();

// http://localhost:8080/v1/

/*   
  Register User
  Get User Details 
*/
app.use("/user", require("../api/v1/user/user.controller"));

/* 
  user authentication
*/
app.use("/auth", require("../api/v1/auth/auth.controller"));

/**
 * Hotels and Rooms status
 */
app.use("/hotel", require("../api/v1/posts/posts.controller"));


module.exports = app;