const {
   getClinicsController,
   getClinicController,
   searchClinicsController,
} = require('../controllers/clinic.controller');

const clinicRouter = require('express').Router();

clinicRouter.get('/:id', getClinicController);
clinicRouter.get('/', getClinicsController);
clinicRouter.get('/search', searchClinicsController);


module.exports = clinicRouter