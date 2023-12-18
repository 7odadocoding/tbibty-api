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
         const response = successResponse('User profile fetched successfully', 200, userProfile);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async getUserById(req, res, next) {
      try {
         const { userId } = req.params;
         const user = await this.service.getUserById(userId);
         const response = successResponse('User fetched successfully', 200, user);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async getMyFavorites(req, res, next) {
      try {
         const { userId } = req.user;
         const favorites = await this.service.getUserFavorites(userId);
         const response = successResponse('User favorites fetched successfully', 200, favorites);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async getMySaves(req, res, next) {
      try {
         const { userId } = req.user;
         const saves = await this.service.getUserSaves(userId);
         const response = successResponse('User saves fetched successfully', 200, saves);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async addOrRemoveFromFavorites(req, res, next) {
      try {
         const { userId } = req.user;
         const { clinicId } = req.body;
         const message = await this.service.addToFavorites(userId, clinicId);
         const response = successResponse(message, 200, null);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async saveOrUnsaveArticle(req, res, next) {
      try {
         const { userId } = req.user;
         const { articleId } = req.body;
         const message = await this.service.saveArticle(userId, articleId);
         const response = successResponse(message, 200, null);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async updateUserData(req, res, next) {
      try {
         const { userId } = req.user;
         const { fullname, age, city, governorate, gender } = req.body;
         const newData = await this.service.updateData(userId, { fullname, age, city, governorate, gender });
         const response = successResponse('User data updated successfully', 200, newData);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async changeImage(req, res, next) {
      try {
         const { userId } = req.user;
         const { secure_url, public_id } = req.body;
         const newImage = await this.service.changeImage(userId, { secure_url, public_id });
         const response = successResponse('User image changed successfully', 200, newImage);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async changePassword(req, res, next) {
      try {
         const { userId } = req.user;
         const { oldPassword, newPassword } = req.body;
         const message = await this.service.changePassword(userId, oldPassword, newPassword);
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
