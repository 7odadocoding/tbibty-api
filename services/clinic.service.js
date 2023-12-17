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

         return await Clinic.findOne(query)
            .select(['doctorName', 'specialization', 'degree', 'phone', 'address', 'locationUrl', 'workTimes', 'price'])
            .lean();
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

   async getClinics(limit, page, category) {
      try {
         let skip = (page - 1) * limit;
         let clinics = await Clinic.find(category ? { category } : {})
            .select([
               'doctorName',
               'specialization',
               'degree',
               'phone',
               'address',
               'locationUrl',
               'workTimes',
               'price',
               'category',
            ])
            .skip(skip)
            .limit(limit)
            .lean();

         return clinics;
      } catch (error) {
         error.name = 'DatabaseError';
         throw error;
      }
   }

   async searchClinics(searchBy, keyword) {
      try {
         const validSearchFields = ['doctorName', 'specialization', 'address'];

         if (!validSearchFields.includes(searchBy)) {
            throw new Error('Invalid search field');
         }

         const searchQuery = {
            [searchBy]: { $regex: new RegExp(keyword, 'i') }, // Case-insensitive search
         };

         const searchResult = await Clinic.find(searchQuery).exec();
         return searchResult;
      } catch (error) {
         console.error('Error in searchClinics:', error.message);
         throw new Error('Failed to perform clinic search');
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
