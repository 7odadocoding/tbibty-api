const mongoose = require('mongoose');
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
         default: 'Not Available',
      },
      locationUrl: {
         type: String,
         required: true,
         default: 'Not Available',
      },
      phone: {
         type: String,
         required: true,
         default: 'Not Available',
      },
      workTimes: {
         type: String,
         required: true,
         default: 'Not Available',
      },
      price: {
         type: Number,
         required: true,
      },
      rate: {
         type: Number,
         required: true,
         default: 0,
      },
      noRates: {
         type: Number,
         required: true,
         default: 0,
      },
      isRemoved: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   { timestamps: true }
);

const Clinic = mongoose.model('clinic', clinicSchema);

module.exports = Clinic;
