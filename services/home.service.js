const Article = require('../models/Article');
const Clinic = require('../models/Clinic');
class HomeService {
   constructor(ClinicModel) {
      this.ClinicModel = ClinicModel;
   }

   async getTopRatedDoctors() {
      try {
         const doctors = await this.ClinicModel.find({ category: 'CLINIC' })
            .select(['doctorName', 'specialization', 'degree', 'phone', 'address', 'locationUrl', 'workTimes', 'price'])
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
            .select(['doctorName', 'specialization', 'degree', 'phone', 'address', 'locationUrl', 'workTimes', 'price'])
            .sort({ reviewsCount: -1, averageRatingValue: -1 })
            .limit(3)
            .exec();

         return labs;
      } catch (error) {
         throw new Error('Failed to get top-rated labs');
      }
   }

   async getLatestArticles() {
      try {
         const latestArticles = await Article.find()
            .select('articleTitle author')
            .populate({
               path: 'author',
               select: 'doctorName',
            })
            .sort({ publicationDate: -1 })
            .limit(1)
            .exec();
         return latestArticles;
      } catch (error) {
         throw new Error('Failed to get the latest articles');
      }
   }
}

module.exports = new HomeService(Clinic);
