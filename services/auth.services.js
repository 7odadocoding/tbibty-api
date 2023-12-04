const MailingService = require('../mail/mailingService');
const User = require('../models/User');
const { hashPassword, checkPassword, generateOTP } = require('../utils/userUtils');

const mailingService = new MailingService();

async function signup(fullname, email, password) {
   try {
      let hashedPassword = await hashPassword(password);
      const newOTP = generateOTP();
      const newOTPExp = 10;
      let user = new User({
         fullname,
         email,
         password: hashedPassword,
         otp: {
            value: newOTP,
            expiryDate: new Date(Date.now() + newOTPExp * 60 * 1000),
            isExpired: false,
         },
      });
      mailingService.sendVerificationEmail(email, newOTP);
      let newUser = await user.save();
      return {
         id: newUser._id,
         fullname: newUser.fullname,
         role: newUser.role,
         emailVerified: user.emailVerified,
         newOTPExp,
      };
   } catch (error) {
      console.log(error);
      error.name = 'DatabaseError';
      throw error;
   }
}
async function login(email, password) {
   try {
      let user = await User.findOne({ email });
      if (!user) return false;
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

async function verifyEmail(email, otp) {
   try {
      const user = await User.findOne({ email });

      if (!user) {
         error.name = 'notFound';
         throw new Error('User not found');
      }

      if (user.otp && !user.otp.isExpired && user.otp.value === otp) {
         user.otp.isExpired = true;
         await user.save();

         user.emailVerified = true;
         await user.save();

         return { success: true, message: 'Email successfully verified' };
      } else {
         return { success: false, message: 'Invalid OTP or OTP has expired' };
      }
   } catch (error) {
      console.error('Error verifying email:', error);
      error.name = 'DatabaseError';
      throw new Error('Internal server error');
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
module.exports = { signup, login, verifyEmail, getUserRole };
