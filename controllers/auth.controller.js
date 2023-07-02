const express = require('express');
const { login, signup } = require('../services/auth.services');
const errorResponse = require('../utils/error');
const successResponse = require('../utils/success');
const { LOGIN_FAILED, LOGIN_SUCCESS, SIGNUP_SUCCESS } = require('../configs/responses');
const { createToken } = require('../utils/tokens');
/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const loginController = async (req, res, next) => {
   try {
      const { username, password } = req.body;
      let user = await login(username, password);

      // --- if username does not exist or password is wrong
      if (!user) {
         let error = errorResponse('unauthorized', LOGIN_FAILED);
         return res.status(error.statusCode).json(error);
      }
      // ---

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
      let { fullname, username, password } = req.body;
      let user = await signup(fullname, username, password);
      let token = createToken(user, '7d');
      let success = successResponse(SIGNUP_SUCCESS, 200, { token });
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

module.exports = {
   signupController,
   loginController,
};
