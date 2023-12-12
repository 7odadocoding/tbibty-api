const Article = require('../models/Article');

class ArticleService {
   constructor(ArticleModel) {
      this.ArticleModel = ArticleModel;
   }

   async getArticles(page = 1, limit = 10) {
      try {
         const skip = (page - 1) * limit;
         const articles = await this.ArticleModel.find().populate('author', 'doctorName').skip(skip).limit(perPage);

         return articles;
      } catch (error) {
         throw error;
      }
   }

   async createArticle(articleData) {
      try {
         const article = await this.ArticleModel.create(articleData);
         return article;
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new ArticleService(Article);
