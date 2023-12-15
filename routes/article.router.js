const articleRouter = require('express').Router();
const articleController = require('../controllers/article.controller');

articleRouter.get('/', articleController.getArticles.bind(articleController));
articleRouter.get('/:id', articleController.getArticle.bind(articleController));

module.exports = articleRouter;
