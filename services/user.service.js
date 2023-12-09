const User = require('../models/User');

class UserService {
   constructor(UserModel) {
      this.UserModel = UserModel;
   }

   async checkEmailVerification(id) {
      try {
         const user = await this.UserModel.findById(id).select('emailVerified');
         return user ? user.emailVerified : false;
      } catch (error) {
         throw error;
      }
   }

   async me(userId) {
      try {
         const user = await this.UserModel.findById(userId).select(
            'fullname email age gender city governorate createdAt'
         );

         if (!user) {
            throw new Error('User not found');
         }

         return user.toObject();
      } catch (error) {
         throw error;
      }
   }

   async getUserById(id) {
      try {
         const user = await this.UserModel.findById(id).select(
            '-password -role -emailVerified -banned -otp -updatedAt -__v -email'
         );
         if (!user) {
            throw new Error('User not found');
         }

         return user;
      } catch (error) {
         throw error;
      }
   }

   async updateName(userId, newName) {
      try {
         const updatedUser = await this.UserModel.findByIdAndUpdate(
            userId,
            { fullname: newName },
            { new: true, runValidators: true }
         );

         if (!updatedUser) {
            throw new Error('User not found');
         }

         return updatedUser.fullname;
      } catch (error) {
         throw error;
      }
   }

   async changePassword(userId, oldPassword, newPassword) {
      try {
         const user = await this.UserModel.findById(userId);
         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         const isPasswordMatch = await user.comparePassword(oldPassword);
         if (!isPasswordMatch) {
            let error = new Error('Incorrect old password');
            error.name = 'unauthorized';
            throw error;
         }

         await user.setPassword(newPassword);

         return 'Password updated successfully';
      } catch (error) {
         throw error;
      }
   }

   async deleteProfile(userId, password) {
      try {
         const user = await this.UserModel.findById(userId);
         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         const isPasswordMatch = await user.comparePassword(password);
         if (!isPasswordMatch) {
            const error = new Error('Incorrect password');
            error.name = 'unauthorized';
            throw error;
         }
         await this.UserModel.deleteOne({ _id: userId });

         return 'Profile deleted successfully';
      } catch (error) {
         console.log(error);
         throw error;
      }
   }
}

module.exports = new UserService(User);
