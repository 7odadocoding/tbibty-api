const homeController = require('../controllers/home.controller');

const homeRouter = require('express').Router();

homeRouter.get('/', homeController.getAllData.bind(homeController));

module.exports = homeRouter;
