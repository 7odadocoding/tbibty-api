const ReviewService = require('../services/review.service');
const successResponse = require('../utils/success');

class ReviewController {
   constructor() {
      this.service = ReviewService;
   }

   async createReview(req, res, next) {
      try {
         const review = await this.service.createReview(req.body);
         const response = successResponse(
            'Review created successfully',
            201,
            review
         );
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async getReviewsByClinic(req, res, next) {
      try {
         const { clinicId } = req.params;
         const reviews = await this.service.getReviewsByClinic(clinicId);
         const response = successResponse(
            'Reviews fetched successfully',
            200,
            reviews
         );
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new ReviewController();
