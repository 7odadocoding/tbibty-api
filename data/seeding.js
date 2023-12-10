const connectDB = require('../configs/db');
const Clinic = require('../models/Clinic');
const fs = require('fs');

const dummyClinics = JSON.parse(fs.readFileSync('./data/clinics.json', 'utf-8'));

async function seed() {
   connectDB();
   const newClinics = await Clinic.create(dummyClinics);
   console.log(newClinics);
}

seed().then(() => {
   console.log('seeding database done');
});
