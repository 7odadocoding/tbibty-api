const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
   governorate_id: {
      type: Number,
      required: true,
   },
   city_name_ar: {
      type: String,
      required: true,
   },
   city_name_en: {
      type: String,
      required: true,
   },
});

const City = mongoose.model('City', citySchema);
module.exports = City;
