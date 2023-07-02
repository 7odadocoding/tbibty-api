const User = require('../models/User');
const { hashPassword, checkPassword } = require('../utils/userUtils');

async function signup(fullname, username, password) {
   try {
      let hashedPassword = await hashPassword(password);
      let user = new User({ fullname, username, password: hashedPassword });
      let newUser = await user.save();
      return {
         id: newUser._id,
         fullname: newUser.fullname,
         role: newUser.role,
      };
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}
async function login(username, password) {
   try {
      let user = await User.findOne({ username });
      let hashedPassword = user.password;
      let isEqual = await checkPassword(password, hashedPassword);
      if (!isEqual) return false;
      return {
         id: user._id,
         fullname: user.fullname,
         role: user.role,
      };
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function getUserRole(id) {
   try {
      // get user by id an select only role then return role from the document
      return (await User.findById(id).select('role')).role;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}
module.exports = { signup, login, getUserRole };
