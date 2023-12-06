const AreaService = require('../services/area.service');
const successResponse = require('../utils/success');

class AreaController {
   constructor() {
      this.service = new AreaService();
   }

   getGovernorates(req, res, next) {
      try {
         const { lang } = req.query;
         const governorates = this.service.getGovernorates(lang);
         const response = successResponse(
            'governorates fetched successfully',
            200,
            governorates
         );
         res.status(response.status).json(response);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }
   getGovernorateCities(req, res, next) {
      try {
         const { governorateId, lang } = req.query;
         const cities = this.service.getGovernorateCities(governorateId, lang);
         const response = successResponse('cities fetched successfully', 200, cities);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = AreaController;
