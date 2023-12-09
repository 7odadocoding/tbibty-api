const Clinic = require('../models/Clinic');

async function getClinicById(id) {
   try {
      return await Clinic.findById(id)
         .select([
            'doctorName',
            'specialization',
            'degree',
            'phone',
            'address',
            'locationUrl',
            'workTimes',
            'price',
         ])
         .lean();
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function getClinics(limit, page) {
   try {
      let skip = (page - 1) * limit;
      let clinics = await Clinic.find()
         .select([
            'doctorName',
            'specialization',
            'degree',
            'phone',
            'address',
            'locationUrl',
            'workTimes',
            'price',
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

const validSearchFields = ['doctorName', 'specialization', 'address'];

async function searchClinics(searchBy, keyword) {
   try {
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

// TODO:DASHBOARD

async function createClinic({
   doctorName,
   specialization,
   degree,
   phone,
   address,
   locationUrl,
   workTimes,
   price,
}) {
   try {
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function updateClinic(id, newProperties) {
   try {
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function removeClinic(id) {
   try {
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

module.exports = { getClinicById, getClinics, searchClinics };
