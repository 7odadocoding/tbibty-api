const {
   getClinicComments,
   getCommentById,
   likeComment,
   dislikeComment,
} = require('../services/comment.services');
const successResponse = require('../utils/success');

const clinicCommentsController = async (req, res, next) => {
   try {
      let { page, limit } = req.query;
      let { clinicId } = req.params;
      let comments = await getClinicComments(limit, page, clinicId);
      let success = successResponse('', 200, comments);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

const getCommentController = async (req, res, next) => {
   try {
      let { id } = req.params;
      let comment = await getCommentById(id);
      let success = successResponse('', 200, comment);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

// [TODO:] a way to determine which user liked or disliked the comment
const likeCommentController = async (req, res, next) => {
   try {
      let { id } = req.params;
      let likes = await likeComment(id);
      let success = successResponse('', 200, likes);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

const dislikeCommentController = async (req, res, next) => {
   try {
      let { id } = req.params;
      let dislikes = await dislikeComment(id);
      let success = successResponse('', 200, dislikes);
      res.status(success.status).json(success);
   } catch (error) {
      next(error);
   }
};

module.exports = {
   clinicCommentsController,
   getCommentController,
   likeCommentController,
   dislikeCommentController,
};
