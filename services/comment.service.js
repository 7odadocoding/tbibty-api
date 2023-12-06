const Comment = require('../models/Comment');

async function getCommentById(commentId) {
   try {
      return await Comment.findById(commentId).lean();
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function getClinicComments(limit, page, clinicId) {
   try {
      let skip = (+page - 1) * limit;
      let comments = await Comment.find({ clinicId }).skip(skip).limit(limit).lean();
      return comments;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

// [TODO:finish after creating comment return comment with user and clinic]
async function createComment(userId, clinicId, content) {
   try {
      let comment = new Comment({ userId, clinicId, content });
      await comment.save();
      let populatedComment = await comment.populate(['userId', 'clinicId']);
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function dislikeComment(commentId, userId) {
   try {
      let comment = await Comment.findByIdAndUpdate(
         commentId,
         { $pull: { dislikes: userId } },
         { new: true }
      ).lean();
      return comment.dislikes.length;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}

async function likeComment(commentId, userId) {
   try {
      let comment = await Comment.findByIdAndUpdate(
         commentId,
         { $push: { likes: userId } },
         { new: true }
      ).lean();
      return comment.likes.length;
   } catch (error) {
      error.name = 'DatabaseError';
      throw error;
   }
}
module.exports = { getClinicComments, getCommentById, dislikeComment, likeComment };
