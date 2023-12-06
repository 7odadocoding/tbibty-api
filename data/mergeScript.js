const cities = require('./cities.json');
const governorates = require('./governorates.json');
const fs = require('fs');

function createArabicVersion() {
   const data = [];
   governorates.forEach((governorate) => {
      data.push({
         [governorate.governorate_name_ar]: cities
            .filter((city) => city.governorate_id == governorate.id)
            .map((city) => city.city_name_ar),
      });
   });
   fs.writeFileSync(__dirname + '/ar_cities.json', JSON.stringify(data, null, 3));
}
function createEnglishVersion() {
   const data = [];
   governorates.forEach((governorate) => {
      data.push({
         [governorate.governorate_name_en]: cities
            .filter((city) => city.governorate_id == governorate.id)
            .map((city) => city.city_name_en),
      });
   });
   fs.writeFileSync(__dirname + '/en_cities.json', JSON.stringify(data, null, 3));
}

function merge() {
   createArabicVersion();
   createEnglishVersion();
}

merge();
