const jwt = require("jsonwebtoken");

// create json web token
module.exports.generateJwtToken = async (jwtPayload) => {
  try {
    const token = await jwt.sign(jwtPayload, process.env.AUTH_JWT, {
      expiresIn: process.env.AUTH_JWT_EXPIRY,
    });
    return token;
  } catch (error) {
    return { token: null };
  }
};

module.exports.verifyAndExtractTokenDetails = async (req, res, next) => {
  try {
    // authorization, Authorization
    const token = req.headers.authorization?.split(" ")[1];
    // to separate Bearer and token

    if (!token) throw new Error("Auth token missing");

    // const isCustomAuth = token.length < 500;

    // verify jwt token
    const jwtDecoded = await jwt.verify(token, process.env.AUTH_JWT);
    // attach decoded jwt with req
    req.user = jwtDecoded;
    next();
  } catch (error) {
    res.status(403).json({ err: error.message });
  }
};
