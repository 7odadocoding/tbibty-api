const {
   loginController,
   signupController,
   verifyEmailController,
   resetPasswordController,
   forgetPasswordController,
   resendOtpController,
} = require('../controllers/auth.controller');
const { resendOtp } = require('../services/auth.services');

const userRouter = require('express').Router();

userRouter.post('/login', loginController);
userRouter.post('/signup', signupController);
userRouter.put('/verify', verifyEmailController);
userRouter.post('/verify/resend', resendOtpController);
userRouter.post('/forget-password', forgetPasswordController);
userRouter.put('/reset-password', resetPasswordController);

module.exports = userRouter;
