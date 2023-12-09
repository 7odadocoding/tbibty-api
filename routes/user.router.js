const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authentication');

const userRouter = require('express').Router();

userRouter.get(
   '/profile',
   authenticate(false),
   userController.getMyProfile.bind(userController)
);
userRouter.get(
   '/:userId',
   userController.getUserById.bind(userController)
);
userRouter.put(
   '/update-name',
   authenticate(false),
   userController.updateUserName.bind(userController)
);

userRouter.put(
   '/change-password',
   authenticate(true),
   userController.changePassword.bind(userController)
);

userRouter.delete(
   '/delete-profile',
   authenticate(true),
   userController.deleteMyProfile.bind(userController)
);

module.exports = userRouter;
