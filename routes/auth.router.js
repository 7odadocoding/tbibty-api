const { loginController, signupController } = require('../controllers/auth.controller');

const userRouter = require('express').Router();

userRouter.post('/login', loginController);
userRouter.post('/signup', signupController);

module.exports = userRouter;
