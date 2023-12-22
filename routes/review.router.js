const reviewRouter = require('express').Router();
const reviewController = require('../controllers/review.controller');
const authenticate = require('../middlewares/authentication');

reviewRouter.get(
   '/clinic/:clinicId',
   authenticate(false, false),
   reviewController.getReviewsForClinic.bind(reviewController)
);
reviewRouter.get('/user', authenticate(true), reviewController.getReviewsForUser.bind(reviewController));
reviewRouter.post('/create', authenticate(true), reviewController.createReview.bind(reviewController));
reviewRouter.put('/:reviewId/helpful', authenticate(true), reviewController.markAsHelpful.bind(reviewController));
reviewRouter.put(
   '/:reviewId/not-helpful',
   authenticate(true),
   reviewController.markAsNotHelpful.bind(reviewController)
);
reviewRouter.put('/:reviewId/report', authenticate(true), reviewController.reportReview.bind(reviewController));
reviewRouter.put('/', authenticate(true), reviewController.updateReview.bind(reviewController));
reviewRouter.delete('/:reviewId', authenticate(true), reviewController.deleteReview.bind(reviewController));

module.exports = reviewRouter;
