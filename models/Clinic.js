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
   },
   { timestamps: true }
);

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
