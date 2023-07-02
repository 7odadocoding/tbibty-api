const errorResponse = require('../utils/error');
const express = require('express');

const authorizeByRole = (role, getUserRole) => {
   /**
    * @param {express.Request} req
    * @param {express.Response} res
    * @param {express.NextFunction} next
    */
   return async (req, res, next) => {
      try {
         let userId = req.user.id;
         /** @type{String}  */
         let userRole = await getUserRole(userId);
         if (userRole !== role) {
            let error = errorResponse('unauthorized', "You don't have access to this resource");
            return res.status(error.statusCode).json(error);
         }
         next();
      } catch (error) {
         next(error);
      }
   };
};

module.exports = authorizeByRole;
