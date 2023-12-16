const clinicalService = require('../services/clinic.service');
const successResponse = require('../utils/success');
const {
   CLINIC_NOT_FOUND,
   GET_CLINIC_SUCCESS,
   SEARCH_SUCCESS,
   GET_CLINICS_SUCCESS,
   LAB_NOT_FOUND,
} = require('../configs/responses');
const CustomError = require('../utils/customError');

class ClinicController {
   constructor() {
      this.service = clinicalService;
   }

   async getClinic(req, res, next) {
      try {
         let { id } = req.params;
         let clinic = await this.service.getClinicById(id);

         if (!clinic) {
            throw new CustomError(CLINIC_NOT_FOUND, 'notFound');
         }

         let success = successResponse(GET_CLINIC_SUCCESS(id), 200, clinic);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async getLab(req, res, next) {
      try {
         let { id } = req.params;
         let lab = await this.service.getLabById(id);

         if (!lab) {
            throw new CustomError(LAB_NOT_FOUND, 'notFound');
         }

         let success = successResponse(GET_CLINIC_SUCCESS(id), 200, lab);
         res.status(success.status).json(success);
      } catch (error) {
         next(error);
      }
   }

   async getClinics(req, res, next) {
      try {
         let { limit, page, category } = req.query;
         if (category && !['LAB', 'CLINIC'].includes(category)) {
            throw new CustomError(`Invalid Category got: ${category} expected: LAB , CLINIC` , 'badRequest');
         }
         let clinics = await this.service.getClinics(limit, page, category);
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
