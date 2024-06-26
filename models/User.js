const mongoose = require('mongoose');
const { checkPassword, hashPassword } = require('../utils/userUtils');
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
      city: {
         governorate_id: {
            type: Number,
            required: true,
         },
         city_name_ar: {
            type: String,
            required: true,
         },
      },
      governorate: {
         id: {
            type: Number,
            required: true,
         },
         governorate_name_ar: {
            type: String,
            required: true,
         },
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
      favorites: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clinic',
         },
      ],
      saves: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
         },
      ],
      image: {
         secure_url: {
            type: String,
            required: true,
            default: 'default',
         },
         public_id: {
            type: String,
            required: true,
            default: 'user_images/default',
         },
      },
   },
   { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
   try {
      return await checkPassword(candidatePassword, this.password);
   } catch (error) {
      throw error;
   }
};

userSchema.methods.setPassword = async function (newPassword) {
   try {
      this.password = await hashPassword(newPassword);
      await this.save();
   } catch (error) {
      throw error;
   }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
