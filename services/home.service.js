const Clinic = require('../models/Clinic');

class HomeService {
   constructor(ClinicModel) {
      this.ClinicModel = ClinicModel;
   }

   async getTopRatedDoctors() {
      try {
         const doctors = await this.ClinicModel.find({ category: 'CLINIC' })
            .sort({ reviewsCount: -1, averageRatingValue: -1 })
            .limit(3)
            .exec();

         return doctors;
      } catch (error) {
         throw new Error('Failed to get top-rated doctors');
      }
   }

   async getTopRatedLabs() {
      try {
         const labs = await this.ClinicModel.find({ category: 'LAB' })
            .sort({ reviewsCount: -1, averageRatingValue: -1 })
            .limit(3)
            .exec();

         return labs;
      } catch (error) {
         throw new Error('Failed to get top-rated labs');
      }
   }
}

module.exports = new HomeService(Clinic);
