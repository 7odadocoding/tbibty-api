const { checkToken } = require('../utils/tokens');
const errorResponse = require('../utils/error');
const userService = require('../services/user.service');

const authenticate = (verified = false, required = true) => {
   return async (req, res, next) => {
      const token = req.headers['authorization'];
      if (!token && required) {
         let error = errorResponse('unauthorized', 'token is required');
         return res.status(error.statusCode).json(error);
      }

      try {
         const user = checkToken(token);
         if (!user && required) {
            let error = errorResponse('unauthorized', 'invalid token');
            return res.status(error.statusCode).json(error);
         }
         const existingUser = await userService.getUserById(user.userId).catch((err) => {
            return false;
         });
         if (!existingUser) {
            if (required) {
               let error = errorResponse('unauthorized', 'user not found');
               return res.status(error.statusCode).json(error);
            }
         }
         if (verified) {
            const isEmailVerified = await userService.checkEmailVerification(user.userId);
            if (!isEmailVerified) {
               let error = errorResponse('unauthorized', 'you should verify your email first');
               return res.status(error.statusCode).json(error);
            }
         }

         req.user = user;
         next();
      } catch (err) {
         if (!required) return next();
         console.log('Error: ' + err.message);
         let error = errorResponse('unauthorized', 'invalid token');
         return res.status(error.statusCode).json(error);
      }
   };
};

module.exports = authenticate;
