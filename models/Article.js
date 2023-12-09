const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   abstract: {
      type: String,
      required: true,
   },
   contentSections: {
      sections: [
         {
            title: {
               type: String,
               required: true,
            },
            content: {
               type: String,
            },
         },
      ],
   },
   authors: [
      {
         name: {
            type: String,
            required: true,
         },
      },
   ],
   keywords: [
      {
         type: String,
      },
   ],
   publicationDate: {
      type: Date,
      default: Date.now,
   },
   views: {
      type: Number,
      default: 0,
   },
   helpfulCount: {
      type: Number,
      default: 0,
   },
   notHelpfulCount: {
      type: Number,
      default: 0,
   },
});

articleSchema.virtual('helpfulness').get(function () {
   const totalVotes = this.helpfulCount + this.notHelpfulCount;
   if (totalVotes === 0) {
      return 0;
   }
   const helpfulPercentage = (this.helpfulCount / totalVotes) * 100;
   return Math.round(helpfulPercentage);
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
