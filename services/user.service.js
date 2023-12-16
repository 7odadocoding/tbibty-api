const { default: mongoose } = require('mongoose');
const User = require('../models/User');

class UserService {
   constructor(UserModel) {
      this.UserModel = UserModel;
   }

   async checkEmailVerification(id) {
      try {
         const user = await this.UserModel.findById(id).select('emailVerified');
         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }
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
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
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
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         return user;
      } catch (error) {
         throw error;
      }
   }

   async getUserFavorites(userId) {
      try {
         const user = await this.UserModel.findById(userId);

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         const favoritesPipeline = [
            { $match: { _id:new mongoose.Types.ObjectId(userId) } },
            {
               $lookup: {
                  from: 'clinics', // Adjust the collection name if needed
                  localField: 'favorites',
                  foreignField: '_id',
                  as: 'clinicFavorites',
               },
            },
            {
               $project: {
                  _id: 0,
                  labs: {
                     $filter: {
                        input: '$clinicFavorites',
                        as: 'clinic',
                        cond: { $eq: ['$$clinic.category', 'LAB'] },
                     },
                  },
                  clinics: {
                     $filter: {
                        input: '$clinicFavorites',
                        as: 'clinic',
                        cond: { $eq: ['$$clinic.category', 'CLINIC'] },
                     },
                  },
               },
            },
         ];

         const favorites = await this.UserModel.aggregate(favoritesPipeline);

         return favorites[0];
      } catch (error) {
         throw error;
      }
   }

   async getUserSaves(userId) {
      try {
         const user = await this.UserModel.findById(userId).populate({
            path: 'saves',
            select: 'articleTitle author',
            populate: { path: 'author', select: 'doctorName' },
         });

         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         return user.saves;
      } catch (error) {
         throw error;
      }
   }

   async addToFavorites(userId, clinicId) {
      try {
         const user = await this.UserModel.findById(userId);
         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         const index = user.favorites.indexOf(clinicId);
         if (index === -1) {
            user.favorites.push(clinicId);
            await user.save();
            return 'Clinic added to favorites successfully';
         } else {
            user.favorites.splice(index, 1);
            s;
            await user.save();
            return 'Clinic removed from favorites successfully';
         }
      } catch (error) {
         throw error;
      }
   }

   async saveArticle(userId, articleId) {
      try {
         const user = await this.UserModel.findById(userId);
         if (!user) {
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
         }

         const index = user.saves.indexOf(articleId);
         if (index === -1) {
            user.saves.push(articleId);
            await user.save();
            return 'Article saved successfully';
         } else {
            user.saves.splice(index, 1); // Remove if already exists
            await user.save();
            return 'Article unsaved successfully';
         }
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
            const error = new Error('User not found');
            error.name = 'notFound';
            throw error;
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
