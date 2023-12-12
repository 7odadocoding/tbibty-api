const articleRouter = require('express').Router();
const articleController = require('../controllers/article.controller');

articleRouter.get('/', articleController.getArticles.bind(articleController));

module.exports = articleRouter;
