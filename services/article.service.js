const Article = require('../models/Article');

class ArticleService {
   constructor(ArticleModel) {
      this.ArticleModel = ArticleModel;
   }

   async getArticles(page = 1, limit = 10) {
      try {
         const skip = (page - 1) * limit;
         const articles = await this.ArticleModel.find()
            .populate({
               path: 'author',
               select: 'doctorName',
            })
            .skip(skip)
            .limit(limit);

         return articles;
      } catch (error) {
         throw error;
      }
   }

   async getArticle(id) {
      try {
         const article = await this.ArticleModel.findById(id);
         if (!article) {
            const error = new Error('Article not found');
            error.name = 'notFound';
            throw error;
         }
         return article;
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
