const Review = require('../models/Review');

class ReviewService {
   async createReview(reviewData) {
      const review = new Review(reviewData);
      return await review.save();
   }

   async getReviewsByClinic(clinicId) {
      return await Review.find({ clinicId });
   }
}

module.exports = new ReviewService();
