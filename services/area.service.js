const fs = require('fs');
const path = require('path');
const Governorate = require('../models/Governorate');
const City = require('../models/City');

class AreaService {
   constructor() {
      this.allowedLangs = ['en', 'ar'];
   }

   validateLang(lang) {
      if (!this.allowedLangs.includes(lang)) {
         const error = new Error(
            `lang should be in ${JSON.stringify(this.allowedLangs)}`
         );
         error.name = 'badRequest';
         throw error;
      }
   }

   async getGovernorates(lang = 'ar') {
      try {
         this.validateLang(lang);
         const governorates = await Governorate.find()
            .sort({ id: 1 })
            .select(`-_id id governorate_name_${lang}`)
            .lean()
            .exec();
         return governorates;
      } catch (error) {
         this.handleError(error);
      }
   }

   async getGovernorateCities(governorateId = '1', lang = 'ar') {
      try {
         this.validateLang(lang);
         const cities = await City.find({ governorate_id: governorateId })
            .select(`-_id governorate_id city_name_${lang}`)
            .lean()
            .exec();
         if (!cities.length) {
            const error = new Error(
               `No cities with requested governorateId: ${governorateId}`
            );
            error.name = 'badRequest';
            throw error;
         }
         return cities;
      } catch (error) {
         this.handleError(error);
      }
   }

   async fillDatabaseFromJson(filePath) {
      try {
         const data = fs.readFileSync(path.resolve(__dirname, filePath));
         const json = JSON.parse(data);
         if (json[0].id) {
            await Governorate.create(json);
         } else {
            await City.create(json);
         }
      } catch (error) {
         this.handleError(error);
      }
   }

   handleError(error, defaultName = 'internal') {
      console.error('Error:', error.message);
      error.name = error.name || defaultName;
      throw error;
   }
}

module.exports = AreaService;
