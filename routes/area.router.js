const AreaController = require('../controllers/area.controller');

const areaRouter = require('express').Router();
const areaController = new AreaController();

areaRouter.get('/governorates', areaController.getGovernorates.bind(areaController));
areaRouter.get(
   '/governorates/cities',
   areaController.getGovernorateCities.bind(areaController)
);

module.exports = areaRouter;
