const {
   loginController,
   signupController,
   verifyEmailController,
} = require('../controllers/auth.controller');

const userRouter = require('express').Router();

userRouter.post('/login', loginController);
userRouter.post('/signup', signupController);
userRouter.post('/verify', verifyEmailController);

module.exports = userRouter;
