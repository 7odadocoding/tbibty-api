const mongoose = require('mongoose');

const governorateSchema = new mongoose.Schema({
   id: {
      type: Number,
      required: true,
      unique: true,
   },
   governorate_name_ar: {
      type: String,
      required: true,
   },
   governorate_name_en: {
      type: String,
      required: true,
   },
});

const Governorate = mongoose.model('Governorate', governorateSchema);
module.exports = Governorate;
