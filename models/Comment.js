const mongoose = require('mongoose');
const { String, Number, ObjectId } = mongoose.Schema.Types;
const commentSchema = new mongoose.Schema(
   {
      content: {
         type: String,
         required: true,
      },
      likes: {
         type: [{ type: ObjectId, ref: 'User' }],
         required: true,
         default: [],
      },
      dislikes: {
         type: [{ type: ObjectId, ref: 'User' }],
         required: true,
         default: [],
      },
      clinicId: {
         type: ObjectId,
         ref: 'Clinic',
         required: true,
      },
      userId: {
         type: ObjectId,
         ref: 'User',
         required: true,
      },
   },
   { timestamps: true }
);

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
