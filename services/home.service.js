const Article = require('../models/Article');
const Clinic = require('../models/Clinic');

class HomeService {
   constructor(ClinicModel) {
      this.ClinicModel = ClinicModel;
   }

   async getTopRatedDoctors() {
      try {
         const topRatedDoctors = await this.ClinicModel.aggregate([
            {
               $match: { category: 'CLINIC' },
            },
            {
               $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'clinicId',
                  as: 'reviews',
               },
            },
            {
               $addFields: {
                  averageRating: {
                     $ifNull: [
                        {
                           $avg: '$reviews.rating',
                        },
                        0,
                     ],
                  },
               },
            },
            {
               $project: {
                  doctorName: 1,
                  thumbnail: 1,
                  specialization: 1,
                  degree: 1,
                  phone: 1,
                  address: 1,
                  locationUrl: 1,
                  workTimes: 1,
                  price: 1,
                  averageRating: 1,
               },
            },
            {
               $sort: { averageRating: -1 },
            },
            {
               $limit: 3,
            },
         ]);

         return topRatedDoctors;
      } catch (error) {
         console.log(error);
         throw new Error('Failed to get top-rated doctors');
      }
   }

   async getTopRatedLabs() {
      try {
         const topRatedLabs = await this.ClinicModel.aggregate([
            {
               $match: { category: 'LAB' },
            },
            {
               $lookup: {
                  from: 'reviews',
                  localField: '_id',
                  foreignField: 'clinicId',
                  as: 'reviews',
               },
            },
            {
               $addFields: {
                  averageRating: {
                     $ifNull: [
                        {
                           $avg: '$reviews.rating',
                        },
                        0,
                     ],
                  },
               },
            },
            {
               $project: {
                  doctorName: 1,
                  thumbnail: 1,
                  specialization: 1,
                  degree: 1,
                  phone: 1,
                  address: 1,
                  locationUrl: 1,
                  workTimes: 1,
                  price: 1,
                  averageRating: 1,
               },
            },
            {
               $sort: { averageRating: -1 },
            },
            {
               $limit: 3,
            },
         ]);

         return topRatedLabs;
      } catch (error) {
         console.log(error);
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
         console.log(error);
         throw new Error('Failed to get the latest articles');
      }
   }
}

module.exports = new HomeService(Clinic);
