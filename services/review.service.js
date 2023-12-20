const mongoose = require('mongoose');
const Review = require('../models/Review');
const CustomError = require('../utils/customError');
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

         const isAlreadyReviewed = await this.ReviewModel.findOne({ userId, clinicId });
         console.log(isAlreadyReviewed);
         if (isAlreadyReviewed) {
            throw new CustomError('You already reviewed this clinic/lab', 'conflict');
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

   async getReviewsForClinic(clinicId, userId, page = 1, limit = 40) {
      try {
         const offset = (page - 1) * limit;

         const aggregationPipeline = [
            { $match: { clinicId: new mongoose.Types.ObjectId(clinicId) } },
            {
               $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'user',
                  pipeline: [
                     {
                        $project: {
                           fullname: 1,
                        },
                     },
                  ],
               },
            },
            {
               $project: {
                  user: '$user',
                  comment: 1,
                  rating: 1,
                  reported: 1,
                  helpfulCount: { $size: '$helpful' },
                  notHelpfulCount: { $size: '$notHelpful' },
                  isHelpful: userId ? { $in: [new mongoose.Types.ObjectId(userId), '$helpful'] } : null,
                  isNotHelpful: userId ? { $in: [new mongoose.Types.ObjectId(userId), '$notHelpful'] } : null,
                  isCurrentUserReview: userId ? { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] } : null,
                  userName: { $arrayElemAt: ['$user.doctorName', 0] }, // Assuming the user has a 'doctorName' field
               },
            },
            { $skip: offset },
            { $limit: limit },
         ];

         if (userId) {
            aggregationPipeline.push({
               $group: {
                  _id: null,
                  total: { $sum: 1 },
                  results: { $push: '$$ROOT' },
               },
            });
         }

         const clinicReviews = await this.ReviewModel.aggregate(aggregationPipeline);

         return userId ? clinicReviews[0].results : clinicReviews;
      } catch (error) {
         console.error('Error in getReviewsForClinic:', error.message);
         throw error;
      }
   }

   async getReviewsForUser(userId) {
      try {
         const userReviews = await this.ReviewModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), clinicId: { $exists: true, $ne: null } } },
            {
               $lookup: {
                  from: 'clinics',
                  localField: 'clinicId',
                  foreignField: '_id',
                  as: 'clinic',
               },
            },
            { $unwind: '$clinic' },
            {
               $project: {
                  clinicId: '$clinic._id',
                  clinicDoctor: '$clinic.doctorName',
                  clinicCategory: '$clinic.category',
                  comment: 1,
                  rating: 1,
                  reported: 1,
                  helpfulCount: { $size: '$helpful' },
                  notHelpfulCount: { $size: '$notHelpful' },
                  isHelpful: { $in: [new mongoose.Types.ObjectId(userId), '$helpful'] },
                  isNotHelpful: { $in: [new mongoose.Types.ObjectId(userId), '$notHelpful'] },
               },
            },
         ]);

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

         if (review.userId.toString() !== userId) {
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

         if (review.userId.toString() !== userId) {
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

   async markAsHelpful(reviewId, userId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);
         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }

         const helpfulUserIndex = review.helpful.indexOf(userId);
         const notHelpfulUserIndex = review.notHelpful.indexOf(userId);

         // Remove user from 'notHelpful' list if present
         if (notHelpfulUserIndex !== -1) {
            review.notHelpful.splice(notHelpfulUserIndex, 1);
         }

         // Add or remove user from 'helpful' list based on previous state
         if (helpfulUserIndex !== -1) {
            review.helpful.splice(helpfulUserIndex, 1);
         } else {
            review.helpful.push(userId);
         }

         await review.save();
         return review;
      } catch (error) {
         console.error('Error in markAsHelpful:', error.message);
         throw error;
      }
   }

   async markAsNotHelpful(reviewId, userId) {
      try {
         const review = await this.ReviewModel.findById(reviewId);
         if (!review) {
            const error = new Error('Review not found');
            error.name = 'notFound';
            throw error;
         }

         const helpfulUserIndex = review.helpful.indexOf(userId);
         const notHelpfulUserIndex = review.notHelpful.indexOf(userId);

         // Remove user from 'helpful' list if present
         if (helpfulUserIndex !== -1) {
            review.helpful.splice(helpfulUserIndex, 1);
         }

         // Add or remove user from 'notHelpful' list based on previous state
         if (notHelpfulUserIndex !== -1) {
            review.notHelpful.splice(notHelpfulUserIndex, 1);
         } else {
            review.notHelpful.push(userId);
         }

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
         review.reported = true;
         await review.save();
         return review;
      } catch (error) {
         console.error('Error in reportReview:', error.message);
         throw error;
      }
   }
}

module.exports = new ReviewService(Review);
