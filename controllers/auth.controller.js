const errorResponse = require('../utils/error');
const successResponse = require('../utils/success');
const { LOGIN_FAILED, LOGIN_SUCCESS, SIGNUP_SUCCESS } = require('../configs/responses');
const { createToken } = require('../utils/tokens');
const AuthService = require('../services/auth.service');
const User = require('../models/User');

class AuthController {
   constructor() {
      this.service = new AuthService(User);
   }
   async login(req, res, next) {
      try {
         const { email, password } = req.body;
         let user = await this.service.login(email, password);

         if (!user) {
            let error = errorResponse('unauthorized', LOGIN_FAILED);
            return res.status(error.statusCode).json(error);
         }

         let token = createToken({ id: user.id, role: user.role }, '7d');
         let success = successResponse(LOGIN_SUCCESS, 200, {
            token,
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            age: user.age,
            gender: user.gender,
            city: user.city,
            governorate: user.governorate,
         });
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async signup(req, res, next) {
      try {
         let { fullname, city, governorate, gender, email, password } = req.body;
         let user = await this.service.signup(
            fullname,
            city,
            governorate,
            gender,
            email,
            password
         );
         let success = successResponse(SIGNUP_SUCCESS, 200, user);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async resendOtp(req, res, next) {
      const { email } = req.body;

      try {
         const result = await this.service.resendOtp(email);

         if (result.success) {
            let response = successResponse(result.message, 200);
            res.status(response.status).json(response);
         } else {
            let response = errorResponse('badRequest', result.message);
            res.status(response.statusCode).json(response);
         }
      } catch (error) {
         console.log(error.message);
         next(error);
      }
   }

   async verifyEmail(req, res, next) {
      const { email, otp } = req.body;

      try {
         const result = await this.service.verifyEmail(email, otp);

         if (result.success) {
            let response = successResponse(result.message, 200);
            res.status(response.status).json(response);
         } else {
            let response = errorResponse('badRequest', result.message);
            res.status(response.statusCode).json(response);
         }
      } catch (error) {
         console.log(error);
         next(error);
      }
   }

   async forgetPassword(req, res, next) {
      const { email } = req.body;

      try {
         const result = await this.service.forgetPassword(email);
         if (result.success) {
            let response = successResponse(result.message, 200);
            res.status(response.status).json(response);
         } else {
            let response = errorResponse('badRequest', result.message);
            res.status(response.statusCode).json(response);
         }
      } catch (error) {
         console.log(error.message);
         next(error);
      }
   }

   async resetPassword(req, res, next) {
      const { email, otp, newPassword } = req.body;

      try {
         const result = await this.service.resetPassword(email, otp, newPassword);

         if (result.success) {
            let response = successResponse(result.message, 200);
            res.status(response.status).json(response);
         } else {
            let response = errorResponse('badRequest', result.message);
            res.status(response.statusCode).json(response);
         }
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
}

module.exports = new AuthController();
