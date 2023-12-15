const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authentication');

const userRouter = require('express').Router();

userRouter.get('/id/:userId', userController.getUserById.bind(userController));
userRouter.get('/profile', authenticate(), userController.getMyProfile.bind(userController));
userRouter.get('/favorites', authenticate(), userController.getMyFavorites.bind(userController));
userRouter.get('/saves', authenticate(), userController.getMySaves.bind(userController));
userRouter.put('/favorites', authenticate(), userController.addOrRemoveFromFavorites.bind(userController));
userRouter.put('/saves', authenticate(), userController.saveOrUnsaveArticle.bind(userController));
userRouter.put('/update-name', authenticate(), userController.updateUserName.bind(userController));
userRouter.put('/change-password', authenticate(), userController.changePassword.bind(userController));
userRouter.delete('/delete-profile', authenticate(true), userController.deleteMyProfile.bind(userController));

module.exports = userRouter;
