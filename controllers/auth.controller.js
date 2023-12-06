const express = require('express');
const {
   login,
   signup,
   verifyEmail,
   forgetPassword,
   resetPassword,
   resendOtp,
} = require('../services/auth.services');
const errorResponse = require('../utils/error');
const successResponse = require('../utils/success');
const { LOGIN_FAILED, LOGIN_SUCCESS, SIGNUP_SUCCESS } = require('../configs/responses');
const { createToken } = require('../utils/tokens');

// mailingService.serviceRunning();
/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const loginController = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      let user = await login(email, password);

      if (!user) {
         let error = errorResponse('unauthorized', LOGIN_FAILED);
         return res.status(error.statusCode).json(error);
      }

      let token = createToken(user, '7d');
      let success = successResponse(LOGIN_SUCCESS, 200, { token });
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signupController = async (req, res, next) => {
   try {
      let { fullname, email, password } = req.body;
      let user = await signup(fullname, email, password);
      let success = successResponse(SIGNUP_SUCCESS, 200, user);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const resendOtpController = async (req, res, next) => {
   const { email } = req.body;

   try {
      const result = await resendOtp(email);

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
};
/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const verifyEmailController = async (req, res, next) => {
   const { email, otp } = req.body;

   try {
      const result = await verifyEmail(email, otp);

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
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const forgetPasswordController = async (req, res, next) => {
   const { email } = req.body;

   try {
      const result = await forgetPassword(email);
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
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const resetPasswordController = async (req, res, next) => {
   const { email, otp, newPassword } = req.body;

   try {
      const result = await resetPassword(email, otp, newPassword);

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
};

module.exports = {
   signupController,
   loginController,
   verifyEmailController,
   resendOtpController,
   forgetPasswordController,
   resetPasswordController,
};
