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
            'rate',
            'noRates'
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

async function searchClinics(searchBy, keyword) {
   try {
      let searchByList = ['doctorName', 'specialization', 'address'];
      if (!searchByList.includes(searchBy)) {
         let error = new Error('Invalid search field');
         error.name = 'ValidationError';
         throw error;
      }
      let searchQuery = {
         [searchBy]: keyword,
      };
      let searchResult = await Clinic.find(searchQuery);
      return searchResult;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function rateClinic(clinicId, rateValue) {
   try {
      let clinic = await Clinic.findById(clinicId);
      let rate = (clinic.noRates * clinic.rate + rateValue) / (clinic.noRates + 1);
      clinic.rate = rate;
      clinic.noRates += 1;
      await clinic.save();
      return rate;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
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

module.exports = { getClinicById, getClinics, searchClinics, rateClinic };
