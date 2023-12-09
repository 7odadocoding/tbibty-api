const userService = require('../services/user.service');
const successResponse = require('../utils/success');

class UserController {
   constructor() {
      this.service = userService;
   }

   async getMyProfile(req, res, next) {
      try {
         const { userId } = req.user;
         const userProfile = await this.service.me(userId);
         const response = successResponse(
            'User profile fetched successfully',
            200,
            userProfile
         );
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async getUserById(req, res, next) {
      try {
         const { userId } = req.params;
         const user = await this.service.getUserById(userId);
         const response = successResponse(
            'User fetched successfully',
            200,
            user
         );
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async updateUserName(req, res, next) {
      try {
         const { userId } = req.user;
         const { newName } = req.body;
         const updatedUser = await this.service.updateName(userId, newName);
         const response = successResponse(
            'User name updated successfully',
            200,
            updatedUser
         );
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async changePassword(req, res, next) {
      try {
         const { userId } = req.user;
         const { oldPassword, newPassword } = req.body;
         const message = await this.service.changePassword(
            userId,
            oldPassword,
            newPassword
         );
         const response = successResponse(message, 200, null);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
   async deleteMyProfile(req, res, next) {
      try {
         const { userId } = req.user;
         const { password } = req.body;
         const message = await this.service.deleteProfile(userId, password);
         const response = successResponse(message, 200, null);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new UserController();
