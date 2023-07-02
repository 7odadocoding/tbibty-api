const mongoose = require('mongoose');
const { String, Boolean } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
   {
      fullname: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enums: ['CUSTOMER', 'DOCTOR','HELPER', 'ADMIN', 'MODERATOR'],
         required: true,
         default: 'CUSTOMER',
      },
      isBanned: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
