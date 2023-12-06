const path = require('path');
const fs = require('fs');
const rootDir = process.cwd();

class AreaService {
   constructor() {
      this.cities = JSON.parse(
         fs.readFileSync(path.join(rootDir, '/data/cities.json'), 'utf-8')
      );
      this.governorates = JSON.parse(
         fs.readFileSync(path.join(rootDir, '/data/governorates.json'), 'utf-8')
      );
      this.allowedLangs = ['en', 'ar'];
   }
   getGovernorates(lang = 'ar') {
      try {
         if (!this.allowedLangs.includes(lang)) {
            const error = new Error(
               `lang should be in ${JSON.stringify(this.allowedLangs)}`
            );
            error.name = 'badRequest';
            throw error;
         }
         return this.governorates.map((governorate) => {
            return {
               id: governorate.id,
               name: governorate[`governorate_name_${lang}`],
            };
         });
      } catch (error) {
         console.log(error);
         this.handleError(error);
      }
   }

   getGovernorateCities(governorateId = '1', lang = 'ar') {
      try {
         if (!this.allowedLangs.includes(lang)) {
            const error = new Error(
               `lang should be in ${JSON.stringify(this.allowedLangs)}`
            );
            error.name = 'badRequest';
            throw error;
         }
         const cities = this.cities.filter((city) => city.governorate_id == governorateId);
         if (!cities.length) {
            const error = new Error(
               `No cities with requested governorateId:${governorateId}`
            );
            error.name = 'badRequest';
            throw error;
         }
         return cities.map((city) => {
            return {
               id: city.id,
               name: city[`city_name_${lang}`],
            };
         });
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
