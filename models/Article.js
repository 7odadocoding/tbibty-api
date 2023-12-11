const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
   articleTitle: {
      type: String,
      required: true,
   },
   abstract: {
      type: String,
      required: true,
   },
   main: {
      sections: [
         {
            sectionTitle: {
               type: String,
               required: true,
            },
            content: {
               type: String,
            },
         },
      ],
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
   },
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
   helpful: [mongoose.Schema.Types.ObjectId],
   notHelpful: [mongoose.Schema.Types.ObjectId],
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
