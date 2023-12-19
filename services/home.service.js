const Article = require('../models/Article');
const Clinic = require('../models/Clinic');
class HomeService {
   constructor(ClinicModel) {
      this.ClinicModel = ClinicModel;
   }

   async getTopRatedDoctors() {
      try {
         let doctors = await this.ClinicModel.find({ category: 'CLINIC' })
            .select([
               'doctorName',
               'thumbnail',
               'specialization',
               'degree',
               'phone',
               'address',
               'locationUrl',
               'workTimes',
               'price',
            ])
            .limit(3)
            .sort({ averageRating: -1 })
            .exec();

         doctors = await Promise.all(
            doctors.map(async (doctor) => {
               doctor.averageRating = await doctor.averageRating;
               return doctor;
            })
         );
         return doctors;
      } catch (error) {
         console.log(error);
         throw new Error('Failed to get top-rated doctors');
      }
   }

   async getTopRatedLabs() {
      try {
         let labs = await this.ClinicModel.find({ category: 'LAB' })
            .select([
               'doctorName',
               'thumbnail',
               'specialization',
               'degree',
               'phone',
               'address',
               'locationUrl',
               'workTimes',
               'price',
            ])
            .limit(3)
            .sort({ averageRating: -1 })
            .exec();
         labs = await Promise.all(
            labs.map(async (lab) => {
               lab.averageRating = await lab.averageRating;
               return lab;
            })
         );

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
