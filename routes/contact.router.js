const contactController = require('../controllers/contact.controller');

const contactRouter = require('express').Router();

contactRouter.post('/', contactController.sendContactEmail.bind(contactController));

module.exports = contactRouter;
