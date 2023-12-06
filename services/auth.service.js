const MailingService = require('../mail/mailingService');
const { hashPassword, checkPassword, generateOTP } = require('../utils/userUtils');

const OTP_EXPIRY_MINUTES = 10;

class AuthService {
   constructor(UserModel) {
      this.UserModel = UserModel;
      this.mailingService = new MailingService();
      this.hashPassword = hashPassword;
      this.checkPassword = checkPassword;
      this.generateOTP = generateOTP;
   }

   async signup(fullname, city, governorate, gender, email, password) {
      try {
         const existentUser = await this.UserModel.findOne({ email });

         if (existentUser) {
            const error = new Error('User Already Exists');
            error.name = 'badRequest';
            throw error;
         }

         const hashedPassword = await this.hashPassword(password);
         const newOTP = this.generateOTP();
         const newOTPExp = OTP_EXPIRY_MINUTES;
         const user = new this.UserModel({
            fullname,
            city,
            governorate,
            gender,
            email,
            password: hashedPassword,
            otp: {
               value: newOTP,
               expiryDate: new Date(Date.now() + newOTPExp * 60 * 1000),
               isExpired: false,
            },
         });

         this.mailingService.sendVerificationEmail(email, newOTP);
         const newUser = await user.save();

         return {
            id: newUser._id,
            fullname: newUser.fullname,
            role: newUser.role,
            emailVerified: user.emailVerified,
            newOTPExp,
         };
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async login(email, password) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) return false;

         const hashedPassword = user.password;
         const isEqual = await this.checkPassword(password, hashedPassword);

         if (!isEqual) return false;

         return {
            id: user._id,
            fullname: user.fullname,
            role: user.role,
            gender: user.gender,
            city: user.city,
            governorate: user.governorate,
            age: user.age,
            email: user.email,
         };
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async resendOtp(email) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            return { success: false, message: 'Email not found' };
         }

         if (user.emailVerified) {
            return { success: false, message: 'Email is already verified' };
         }

         const newOTP = this.generateOTP();

         user.otp = {
            value: newOTP,
            expiryDate: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
            isExpired: false,
         };

         this.mailingService.sendVerificationEmail(email, newOTP);
         await user.save();

         return {
            success: true,
            expiryDate: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
            message: 'A new OTP has been successfully sent to your email address.',
         };
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async verifyEmail(email, otp) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         if (user.otp && !user.otp.isExpired && user.otp.value === otp) {
            user.otp.isExpired = true;
            user.emailVerified = true;
            await user.save();

            return { success: true, message: 'Email successfully verified' };
         } else {
            return { success: false, message: 'Invalid OTP or OTP has expired' };
         }
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async forgetPassword(email) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) return { success: false, message: 'Email not found' };

         const newPasswordOTP = this.generateOTP();
         user.otp = {
            value: newPasswordOTP,
            expiryDate: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
            isExpired: false,
         };

         this.mailingService.sendForgotPasswordEmail(email, newPasswordOTP);
         await user.save();

         return {
            success: true,
            expiryDate: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
            message: 'An OTP has been successfully sent to your email address.',
         };
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async resetPassword(email, otp, newPassword) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            const error = new Error('User Not Found');
            error.name = 'notFound';
            throw error;
         }

         if (user.otp && !user.otp.isExpired && user.otp.value === otp) {
            user.otp.isExpired = true;
            user.password = await this.hashPassword(newPassword);
            await user.save();

            return { success: true, message: 'Password successfully reseted' };
         } else {
            return { success: false, message: 'Invalid OTP or OTP has expired' };
         }
      } catch (error) {
         this.handleErrors(error);
      }
   }

   async getUserRole(id) {
      try {
         // get user by id and select only role then return role from the document
         return (await this.UserModel.findById(id).select('role')).role;
      } catch (error) {
         this.handleErrors(error);
      }
   }

   handleErrors(error, defaultName = 'DatabaseError') {
      console.error('Error:', error);
      error.name = error.name || defaultName;
      throw error;
   }
}

module.exports = AuthService;
