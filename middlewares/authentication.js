const jwt = require('jsonwebtoken');
const express = require('express');
const { jwtSecret } = require('../configs/env');
const errorResponse = require('../utils/error');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const authenticate = (req, res, next) => {
   const token = req.headers['authorization'];
   if (!token) {
      let error = errorResponse('unauthorized', 'token is required');
      return res.status(error.statusCode).json(error);
   }

   jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
         let error = errorResponse('unauthorized', 'invalid token');
         return res.status(error.statusCode).json(error);
      }
      req.user = user;
      next();
   });
};

module.exports = authenticate;
