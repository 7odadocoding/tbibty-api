const reviewService = require('../services/review.service');
const successResponse = require('../utils/success');

class ReviewController {
   constructor() {
      this.service = reviewService;
   }

   async createReview(req, res, next) {
      try {
         const { clinicId, rating, comment } = req.body;
         const { userId } = req.user;
         const review = await this.service.createReview(userId, clinicId, rating, comment);
         const response = successResponse('Review created successfully', 201, review);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in createReview:', error.message);
         next(error);
      }
   }

   async getReviewsForClinic(req, res, next) {
      try {
         const { page, limit } = req.query;
         const { clinicId } = req.params;
         const reviews = await this.service.getReviewsForClinic(clinicId, page, limit);
         const response = successResponse('Reviews fetched successfully', 200, reviews);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in getReviewsForClinic:', error.message);
         next(error);
      }
   }

   async getReviewsForUser(req, res, next) {
      try {
         const { userId } = req.user;
         const reviews = await this.service.getReviewsForUser(userId);
         const response = successResponse('Reviews fetched successfully', 200, reviews);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in getReviewsForUser:', error.message);
         next(error);
      }
   }

   async deleteReview(req, res, next) {
      try {
         const { reviewId } = req.params;
         const { userId } = req.user;
         await this.service.deleteReview(reviewId, userId);
         const response = successResponse('Review deleted successfully', 204);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in deleteReview:', error.message);
         next(error);
      }
   }

   async updateReview(req, res, next) {
      try {
         const { reviewId, rating, comment } = req.body;
         const { userId } = req.user;
         const updatedReview = await this.service.updateReview(reviewId, userId, rating, comment);
         const response = successResponse('Review updated successfully', 200, updatedReview);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in updateReview:', error.message);
         next(error);
      }
   }

   async markAsHelpful(req, res, next) {
      try {
         const { reviewId } = req.params;
         const review = await this.service.markAsHelpful(reviewId);
         const response = successResponse('Marked as helpful successfully', 200, review);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in markAsHelpful:', error.message);
         next(error);
      }
   }

   async markAsNotHelpful(req, res, next) {
      try {
         const { reviewId } = req.params;
         const review = await this.service.markAsNotHelpful(reviewId);
         const response = successResponse('Marked as not helpful successfully', 200, review);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in markAsNotHelpful:', error.message);
         next(error);
      }
   }

   async reportReview(req, res, next) {
      try {
         const { reviewId } = req.params;
         const review = await this.service.reportReview(reviewId);
         const response = successResponse('Review reported successfully', 200, review);
         res.status(response.status).json(response);
      } catch (error) {
         console.error('Error in reportReview:', error.message);
         next(error);
      }
   }
}

module.exports = new ReviewController();
