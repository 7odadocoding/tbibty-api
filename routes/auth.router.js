const authController = require('../controllers/auth.controller');

const userRouter = require('express').Router();

userRouter.post('/login', authController.login.bind(authController));
userRouter.post('/signup', authController.signup.bind(authController));
userRouter.put('/verify', authController.verifyEmail.bind(authController));
userRouter.post('/verify/resend', authController.resendOtp.bind(authController));
userRouter.post('/forget-password', authController.forgetPassword.bind(authController));
userRouter.put('/reset-password', authController.resetPassword.bind(authController));

module.exports = userRouter;
