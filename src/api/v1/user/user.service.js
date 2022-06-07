const bcrypt = require("bcryptjs");
const userRepository = require("../../../database/mongo/repositories/user.repository");
const jwtService = require("../../../services/jwt.service");


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const checkDuplicateUser = async (userReqObj) => {
  const userDetails = await userRepository.getUserDetailsByCriteria({
    $or: [
      {
        email: userReqObj.email,
      },
      {
        phoneNumber: userReqObj.phoneNumber,
      },
    ],
  });

  if (userDetails.length) {
    throw new Error("User with same email/phone number already exists.");
  }
  return;
};

module.exports.getUser = async (req, res) => {
  try {
    const { email } = req?.user;
  
    res
      .status(200)
      .json(await userRepository.getUserDetailsByCriteria({ email }));
  } catch (error) {
    res.status(404).json({ message: error.message})
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    const reqObj = req.body;

    // check for duplicate account
    await checkDuplicateUser(reqObj);

    switch (reqObj.registrationType) {
      case "email":
        // hashing password
        reqObj.password = await hashPassword(reqObj.password);

        await userRepository.createUser(reqObj);
    
        const token = await jwtService.generateJwtToken({email: reqObj.email});
        
        res.status(201).json({ reqObj, token });
        break;
      case "google":
        // register user via google
      case "phone":
        // register user via phone number
      default:
        break;
    }

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
