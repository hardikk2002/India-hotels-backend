const bcrypt = require("bcryptjs");
const jwtService = require("../../../services/jwt.service");
const userRepository = require("../../../database/mongo/repositories/user.repository");

module.exports.authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists or not
    const userObj = await userRepository.checkIfUserExists({ email });

    if (!userObj)
      return res.status(404).json({ message: "User Doesn't exists" });

    // check if password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, userObj.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });

    const token = await jwtService.generateJwtToken({ email: userObj.email });

    res.status(200).json({ userObj, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
