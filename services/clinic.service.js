const { default: mongoose, isValidObjectId } = require('mongoose');
const Clinic = require('../models/Clinic');
const CustomError = require('../utils/customError');

class ClinicService {
   constructor(ClinicModel) {
      this.ClinicModel = ClinicModel;
   }

   async findOne(id, category) {
      try {
         if (!isValidObjectId(id)) {
            throw new CustomError('the id passed is not a valid objectId', 'badRequest');
         }

         const query = {
            $and: [{ _id: new mongoose.Types.ObjectId(id) }, category ? { category } : {}],
         };

         const clinic = await Clinic.aggregate([
            {
               $match: query,
            },
            {
               $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'clinicId',
                  as: 'reviews',
               },
            },
            {
               $addFields: {
                  averageRating: {
                     $ifNull: [
                        {
                           $avg: '$reviews.rating',
                        },
                        0,
                     ],
                  },
               },
            },
            {
               $project: {
                  doctorName: 1,
                  specialization: 1,
                  degree: 1,
                  phone: 1,
                  address: 1,
                  locationUrl: 1,
                  thumbnail: 1,
                  rating: 1,
                  workTimes: 1,
                  price: 1,
                  averageRating: 1,
               },
            },
         ]);

         if (clinic.length === 0) {
            throw new CustomError(category + ' not found', 'notFound');
         }

         return clinic[0];
      } catch (error) {
         console.log(error);
         throw error;
      }
   }

   async getClinicById(id) {
      return await this.findOne(id, 'CLINIC');
   }

   async getLabById(id) {
      return await this.findOne(id, 'LAB');
   }

   async getClinics(limit = 10, page = 1, category) {
      try {
         let skip = (parseInt(page) - 1) * parseInt(limit);
         console.log(parseInt(limit), page, skip);
         let clinics = await Clinic.aggregate([
            {
               $match: category ? { category } : {},
            },
            {
               $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'clinicId',
                  as: 'reviews',
               },
            },
            {
               $addFields: {
                  averageRating: {
                     $ifNull: [
                        {
                           $avg: '$reviews.rating',
                        },
                        0,
                     ],
                  },
               },
            },
            {
               $project: {
                  doctorName: 1,
                  specialization: 1,
                  degree: 1,
                  phone: 1,
                  address: 1,
                  locationUrl: 1,
                  workTimes: 1,
                  price: 1,
                  thumbnail: 1,
                  category: 1,
                  averageRating: 1,
               },
            },
            {
               $skip: skip,
            },
            {
               $limit: parseInt(limit),
            },
         ]);

         return clinics;
      } catch (error) {
         throw error;
      }
   }

   async searchClinics(searchBy = 'doctorName', keyword, category) {
      try {
         const validSearchFields = ['doctorName', 'specialization', 'address'];
         const allowedCategories = ['CLINIC', 'LAB'];

         if (!searchBy || !keyword) {
            throw new CustomError('Search parameters are required', 'badRequest');
         }
         if (!validSearchFields.includes(searchBy)) {
            throw new CustomError('Invalid search field', 'badRequest');
         }
         if (category && !allowedCategories.includes(category)) {
            throw new CustomError('Invalid category', 'badRequest');
         }

         const searchQuery = {
            [searchBy]: { $regex: new RegExp(keyword, 'i') },
            category: { $in: category ? [category] : allowedCategories },
         };

         let searchResult = await Clinic.aggregate([
            {
               $match: searchQuery,
            },
            {
               $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'clinicId',
                  as: 'reviews',
               },
            },
            {
               $addFields: {
                  averageRating: {
                     $ifNull: [
                        {
                           $avg: '$reviews.rating',
                        },
                        0,
                     ],
                  },
               },
            },
            {
               $project: {
                  doctorName: 1,
                  specialization: 1,
                  thumbnail: 1,
                  category: 1,
                  averageRating: 1,
               },
            },
         ]);

         if (searchResult.length) {
            return searchResult;
         }

         return [];
      } catch (error) {
         console.error('Error in searchClinics:', error.message);
         throw error;
      }
   }

   async createClinic({ doctorName, specialization, degree, phone, address, locationUrl, workTimes, price, category }) {
      try {
         const clinic = new Clinic({
            doctorName,
            specialization,
            degree,
            phone,
            address,
            locationUrl,
            workTimes,
            price,
            category,
         });

         await clinic.save();
         return clinic.toObject(); // Returning the clinic object after saving
      } catch (error) {
         error.name = 'DatabaseError';
         throw error;
      }
   }

   async updateClinic(id, newProperties) {
      try {
         const updatedClinic = await Clinic.findByIdAndUpdate(
            id,
            { $set: newProperties },
            { new: true, runValidators: true }
         );

         if (!updatedClinic) {
            const error = new Error('Clinic not found for updating');
            error.name = 'NotFound';
            throw error;
         }

         return updatedClinic.toObject();
      } catch (error) {
         error.name = 'DatabaseError';
         throw error;
      }
   }

   async removeClinic(id) {
      try {
         const removedClinic = await Clinic.findByIdAndRemove(id);

         if (!removedClinic) {
            const error = new Error('Clinic not found for removal');
            error.name = 'NotFound';
            throw error;
         }
      } catch (error) {
         error.name = 'DatabaseError';
         throw error;
      }
   }
}

module.exports = new ClinicService(Clinic);
