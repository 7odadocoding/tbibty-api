const clinicalService = require('../services/clinic.service');
const successResponse = require('../utils/success');
const { CLINIC_NOT_FOUND, GET_CLINIC_SUCCESS, SEARCH_SUCCESS, GET_CLINICS_SUCCESS } = require('../configs/responses');

class ClinicController {
   constructor() {
      this.service = clinicalService;
   }

   async getClinic(req, res, next) {
      try {
         let { id } = req.params;
         let clinic = await this.service.getClinicById(id);

         if (!clinic) {
            let error = new Error(CLINIC_NOT_FOUND);
            error.name = 'NotFound';
            throw error;
         }

         let success = successResponse(GET_CLINIC_SUCCESS(id), 200, clinic);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async getClinics(req, res, next) {
      try {
         let { limit, page } = req.query;
         let clinics = await this.service.getClinics(limit, page);
         let success = successResponse(GET_CLINICS_SUCCESS, 200, clinics);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async searchClinics(req, res, next) {
      try {
         let { by, keyword } = req.query;
         let searchResult = await this.service.searchClinics(by, keyword);
         let success = successResponse(SEARCH_SUCCESS, 200, searchResult);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async createClinic(req, res, next) {
      try {
         const clinicData = req.body;
         const clinic = await this.service.createClinic(clinicData);
         const success = successResponse('Clinic created successfully', 201, clinic);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async updateClinic(req, res, next) {
      try {
         const { id } = req.params;
         const newProperties = req.body;
         const updatedClinic = await this.service.updateClinic(id, newProperties);
         const success = successResponse('Clinic updated successfully', 200, updatedClinic);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async removeClinic(req, res, next) {
      try {
         const { id } = req.params;
         await this.service.removeClinic(id);
         const success = successResponse('Clinic removed successfully', 204);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new ClinicController();
