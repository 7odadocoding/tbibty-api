const { checkToken } = require('../utils/tokens');
const errorResponse = require('../utils/error');
const userService = require('../services/user.service');

const authenticate = (verified = false) => {
   return async (req, res, next) => {
      const token = req.headers['authorization'];
      if (!token) {
         let error = errorResponse('unauthorized', 'token is required');
         return res.status(error.statusCode).json(error);
      }

      const user = checkToken(token);
      if (!user) {
         let error = errorResponse('unauthorized', 'invalid token');
         return res.status(error.statusCode).json(error);
      }

      try {
         const existingUser = await userService
            .getUserById(user.userId)
            .catch((err) => {
               return false;
            });
         if (!existingUser) {
            let error = errorResponse('unauthorized', 'user not found');
            return res.status(error.statusCode).json(error);
         }
         console.log('here');
         if (verified) {
            const isEmailVerified = await userService.checkEmailVerification(
               user.userId
            );
            if (!isEmailVerified) {
               let error = errorResponse(
                  'unauthorized',
                  'you should verify your email first'
               );
               return res.status(error.statusCode).json(error);
            }
         }

         req.user = user;
         next();
      } catch (err) {
         console.log(err);
         let error = errorResponse('unauthorized', 'invalid token');
         return res.status(error.statusCode).json(error);
      }
   };
};

module.exports = authenticate;
