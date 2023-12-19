const mongoose = require('mongoose');
const Review = require('./Review');
const { String, Number, Boolean } = mongoose.Schema.Types;

const clinicSchema = new mongoose.Schema(
   {
      doctorName: {
         type: String,
         required: true,
      },
      specialization: {
         type: String,
         required: true,
      },
      degree: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
         default: 'N/A',
      },
      locationUrl: {
         type: String,
         required: true,
         default: 'N/A',
      },
      phone: {
         type: String,
         required: true,
         default: 'N/A',
      },
      workTimes: {
         type: String,
         required: true,
         default: 'N/A',
      },
      price: {
         type: Number,
         required: true,
         default: 'N/A',
      },
      isRemoved: {
         type: Boolean,
         required: true,
         default: false,
      },
      thumbnail: {
         type: String,
         default: 'N/A',
      },
      category: {
         type: String,
         enum: ['CLINIC', 'LAB', 'XRAY'],
      },
      averageRating: {
         type: Number,
         virtual: true,
         get: async function () {
            try {
               const averageRating = await Review.aggregate([
                  {
                     $match: { clinicId: this._id },
                  },
                  {
                     $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                     },
                  },
               ]);

               return averageRating.length > 0 ? averageRating[0].averageRating : 0;
            } catch (error) {
               console.error('Error calculating average rating:', error);
               throw error;
            }
         },
      },
   },
   { timestamps: true }
);

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
