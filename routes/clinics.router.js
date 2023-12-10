const clinicController = require('../controllers/clinic.controller');
const clinicRouter = require('express').Router();

clinicRouter.get('/:id', clinicController.getClinic.bind(clinicController));
clinicRouter.get('/', clinicController.getClinics.bind(clinicController));
clinicRouter.get('/search', clinicController.searchClinics.bind(clinicController));
clinicRouter.post('/', clinicController.createClinic.bind(clinicController));
clinicRouter.put('/:id', clinicController.updateClinic.bind(clinicController));
clinicRouter.delete('/:id', clinicController.removeClinic.bind(clinicController));

module.exports = clinicRouter;
