const authController = require('../controllers/auth.controller');

const authRouter = require('express').Router();

authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/signup', authController.signup.bind(authController));
authRouter.put('/verify', authController.verifyEmail.bind(authController));
authRouter.post('/verify/resend', authController.resendOtp.bind(authController));
authRouter.post('/forget-password', authController.forgetPassword.bind(authController));
authRouter.post('/validate-otp', authController.validateOTP.bind(authController));
authRouter.put('/reset-password', authController.resetPassword.bind(authController));

module.exports = authRouter;
