const articleService = require('../services/article.service');
const successResponse = require('../utils/success');

class ArticleController {
   constructor() {
      this.service = articleService;
   }

   async getArticles(req, res, next) {
      try {
         const { page, limit } = req.query;
         const articles = await this.service.getArticles(page, limit);
         const response = successResponse('Articles fetched successfully', 200, articles);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
   async getArticle(req, res, next) {
      try {
         const { id } = req.params;
         const article = await this.service.getArticle(id);
         const response = successResponse('Article fetched successfully', 200, article);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new ArticleController();
