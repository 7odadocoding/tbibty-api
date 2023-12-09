const homeService = require('../services/home.service');
const successResponse = require('../utils/success');

class HomeController {
   constructor(homeService) {
      this.homeService = homeService;
   }

   async getAllData(req, res, next) {
      try {
         const topRatedDoctors = await this.homeService.getTopRatedDoctors();
         const topRatedLabs = await this.homeService.getTopRatedLabs();

         const responseData = {
            topRatedDoctors,
            topRatedLabs,
         };

         const response = successResponse(
            'All data fetched successfully',
            200,
            responseData
         );

         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new HomeController(homeService);
