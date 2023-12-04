const mongoose = require('mongoose');
const { String, Boolean } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
   {
      fullname: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         unique: true,
      },
      age: {
         type: Number,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enums: ['CUSTOMER', 'DOCTOR', 'HELPER', 'ADMIN', 'MODERATOR'],
         required: true,
         default: 'CUSTOMER',
      },
      otp: {
         value: String,
         expiryDate: Date,
         isExpired: {
            type: Boolean,
            default: false,
         },
      },
      emailVerified: {
         type: Boolean,
         required: true,
         default: false,
      },
      banned: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
