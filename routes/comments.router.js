const {
   clinicCommentsController,
   getCommentController,
   likeCommentController,
   dislikeCommentController,
} = require('../controllers/comment.controller');
const authenticate = require('../middlewares/authentication');
const authorizeByRole = require('../middlewares/authorization');

const commentRouter = require('express').Router();

commentRouter.get('/:clinicId', clinicCommentsController);
commentRouter.get('/comment/:id', getCommentController);
commentRouter.post('/', authenticate, authorizeByRole('CUSTOMER'));
commentRouter.put('/like/:id', authenticate, authorizeByRole('CUSTOMER'), likeCommentController);
commentRouter.put('/dislike/:id', authenticate, authorizeByRole('CUSTOMER'), dislikeCommentController);

module.exports = commentRouter;
