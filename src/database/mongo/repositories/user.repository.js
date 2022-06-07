const User = require("../schemas/Users.schema");

const createUser = async (userOnBoardingObj) => {
  const newUser = new User(userOnBoardingObj);  
  return await newUser.save();
};

const getUserDetailsByCriteria = async (searchObj) => {
  return User.find(searchObj);
};

const checkIfUserExists = async (email) =>{
  return await User.findOne(email);
};

module.exports = {
  createUser,
  getUserDetailsByCriteria,
  checkIfUserExists,
};