const {
   loginController,
   signupController,
   verifyEmailController,
   resetPasswordController,
   forgetPasswordController,
} = require('../controllers/auth.controller');

const userRouter = require('express').Router();

userRouter.post('/login', loginController);
userRouter.post('/signup', signupController);
userRouter.post('/verify', verifyEmailController);
userRouter.post('/forget-password', forgetPasswordController);
userRouter.put('/reset-password', resetPasswordController);

module.exports = userRouter;
