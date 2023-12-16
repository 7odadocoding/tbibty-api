const MailingService = require('../mail/mailingService');
const { hashPassword, checkPassword, generateOTP } = require('../utils/userUtils');

const OTP_EXPIRY_MINUTES = 5;

class AuthService {
   constructor(UserModel) {
      this.UserModel = UserModel;
      this.mailingService = new MailingService();
      this.hashPassword = hashPassword;
      this.checkPassword = checkPassword;
      this.generateOTP = generateOTP;
   }

   async signup(fullname, city, governorate, gender, email, password, image) {
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
         await this.mailingService.sendVerificationEmail(email, newOTP);
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
            image,
         });

         const newUser = await user.save();

         return {
            id: newUser._id,
            fullname: newUser.fullname,
            role: newUser.role,
            emailVerified: user.emailVerified,
            newOTPExp,
            secure_url: newUser.image.secure_url,
         };
      } catch (error) {
         throw error;
      }
   }

   async login(email, password) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

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
            image: user.image,
         };
      } catch (error) {
         throw error;
      }
   }

   async resendOtp(email) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
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
         throw error;
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

         const isExpired = new Date(Date.now()) > user.otp.expiryDate;
         if (user.otp && !user.otp.isExpired && user.otp.value === otp && !isExpired) {
            user.otp.isExpired = true;
            user.emailVerified = true;
            await user.save();

            return { success: true, message: 'Email successfully verified' };
         }
         return { success: false, message: 'Invalid OTP or OTP has expired' };
      } catch (error) {
         throw error;
      }
   }

   async forgetPassword(email) {
      try {
         const user = await this.UserModel.findOne({ email });

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

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
         throw error;
      }
   }

   async validateOTP(email, otp) {
      try {
         const user = await this.UserModel.findOne({ email });
         if (!user) {
            const error = new Error('User Not Found');
            error.name = 'notFound';
            throw error;
         }

         const isExpired = new Date(Date.now()) > user.otp.expiryDate;
         if (user.otp && !user.otp.isExpired && user.otp.value === otp && !isExpired) {
            return { success: true, message: 'valid OTP' };
         }
         return { success: false, message: 'Invalid OTP or OTP has expired' };
      } catch (error) {
         throw error;
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

         const isExpired = new Date(Date.now()) > user.otp.expiryDate;
         if (user.otp && !user.otp.isExpired && user.otp.value === otp && !isExpired) {
            user.otp.isExpired = true;
            user.password = await this.hashPassword(newPassword);
            await user.save();
            return { success: true, message: 'Password successfully reseted' };
         }
         return { success: false, message: 'Invalid OTP or OTP has expired' };
      } catch (error) {
         throw error;
      }
   }

   async getUserRole(id) {
      try {
         // get user by id and select only role then return role from the document
         return (await this.UserModel.findById(id).select('role')).role;
      } catch (error) {
         throw error;
      }
   }
}

module.exports = AuthService;
