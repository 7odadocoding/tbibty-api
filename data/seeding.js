const connectDB = require('../configs/db');
const AreaService = require('../services/area.service');

connectDB();

const areaService = new AreaService();

async function seed() {
   await areaService.fillDatabaseFromJson('../data/governorates.json');
   await areaService.fillDatabaseFromJson('../data/cities.json');
}

seed().then(() => {
   console.log('seeding database done');
});
