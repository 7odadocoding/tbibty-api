const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      clinicId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Clinic',
         required: true,
      },
      rating: {
         type: Number,
         required: true,
         min: 1,
         max: 5,
      },
      comment: {
         type: String,
         trim: true,
         maxlength: 1000,
      },
      helpful: [mongoose.Schema.Types.ObjectId],
      notHelpful: [mongoose.Schema.Types.ObjectId],
      reported: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
