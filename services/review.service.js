const Review = require('../models/Review');

class ReviewService {
   constructor(ReviewModel) {
      this.ReviewModel = ReviewModel;
   }

   async createReview(userId, clinicId, rating, comment = null) {
      /*
            TODO: validate clinicId
            userId is already set by server no need to validate it.
      */
      try {
         let isValidRating = rating >= 1 && rating <= 5;

         if (!rating || !isValidRating) {
            const error = new Error('Rating required and should be in the range of (1,5)');
            error.name = 'badRequest';
            throw error;
         }

         const review = new this.ReviewModel({
            userId,
            clinicId,
            rating,
            comment,
         });

         return await review.save();
      } catch (error) {
         console.error('Error in createReview:', error.message);
         throw error;
      }
   }

   async getReviewsForClinic(clinicId, page = 1, limit = 40) {
      try {
         const offset = (page - 1) * limit;
         const clinicReviews = await this.ReviewModel.find({ clinicId })
            .select('comment rating helpfulCount notHelpfulCount')
            .skip(offset)
            .limit(limit)
            .populate({ path: 'userId', select: '_id fullname' })
            .lean();

         console.log(clinicReviews , clinicId);
         return clinicReviews;
      } catch (error) {
         console.error('Error in getReviewsForClinic:', error.message);
         throw error;
      }
   }

   async getReviewsForUser(userId) {
      try {
         const userReviews = await this.ReviewModel.find({ userId })
            .select('comment rating helpfulCount notHelpfulCount')
            .populate({ path: 'clinicId', select: '_id name' })
            .lean();
         return userReviews;
      } catch (error) {
         console.error('Error in getReviewsForUser:', error.message);
         throw error;
      }
   }

   async deleteReview(reviewId, userId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);

         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }

         if (review.userId !== userId) {
            const error = new Error('You are not the owner of this review');
            error.name = 'unauthorized';
            throw error;
         }

         await review.remove();
         return {
            message: 'Review deleted successfully',
            deletedReview: review,
         };
      } catch (error) {
         console.error('Error in deleteReview:', error.message);
         throw error;
      }
   }
   async updateReview(reviewId, userId, rating = null, comment = null) {
      try {
         const review = await this.ReviewModel.findById(reviewId);

         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }

         if (review.userId !== userId) {
            const error = new Error('You are not the owner of this review');
            error.name = 'unauthorized';
            throw error;
         }

         if (rating !== null && (rating < 1 || rating > 5)) {
            const error = new Error('New rating should be in the range of (1, 5)');
            error.name = 'badRequest';
            throw error;
         }

         review.rating = rating !== null ? rating : review.rating;
         review.comment = comment !== null ? comment : review.comment;
         await review.save();

         return {
            message: 'Review updated successfully',
            updatedReview: {
               comment: review.comment,
               rating: review.rating,
            },
         };
      } catch (error) {
         console.error('Error in updateReview:', error.message);
         throw error;
      }
   }

   async markAsHelpful(reviewId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);
         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }
         review.helpfulCount++;
         await review.save();
         return review;
      } catch (error) {
         console.error('Error in markAsHelpful:', error.message);
         throw error;
      }
   }

   async markAsNotHelpful(reviewId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);
         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }
         review.notHelpfulCount++;
         await review.save();
         return review;
      } catch (error) {
         console.error('Error in markAsNotHelpful:', error.message);
         throw error;
      }
   }

   async reportReview(reviewId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);
         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }
         review.reportCount++;
         await review.save();
         return review;
      } catch (error) {
         console.error('Error in reportReview:', error.message);
         throw error;
      }
   }
}

module.exports = new ReviewService(Review);
