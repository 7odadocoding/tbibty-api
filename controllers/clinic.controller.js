const express = require('express');
const { getClinicById, getClinics, searchClinics } = require('../services/clinic.services');
const successResponse = require('../utils/success');
const {
   CLINIC_NOT_FOUND,
   GET_CLINIC_SUCCESS,
   SEARCH_SUCCESS,
   GET_CLINICS_SUCCESS,
} = require('../configs/responses');

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getClinicController = async (req, res, next) => {
   try {
      let { id } = req.params;
      let clinic = await getClinicById(id);
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
};

const getClinicsController = async (req, res, next) => {
   try {
      let { limit, page } = req.query;
      let clinics = await getClinics(limit, page);
      let success = successResponse(GET_CLINICS_SUCCESS, 200, clinics);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

const searchClinicsController = async (req, res, next) => {
   try {
      let { by, keyword } = req.query;
      let searchResult = await searchClinics(by, keyword);
      let success = successResponse(SEARCH_SUCCESS, 200, searchResult);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

module.exports = { getClinicController, getClinicsController, searchClinicsController };
