const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../middlewares/multer');

const uploadRouter = require('express').Router();

uploadRouter.post('/user', uploadMiddleware('user-image'), uploadController.uploadUserImage.bind(uploadController));
uploadRouter.delete('/destroy', uploadController.destroyImage.bind(uploadController));

module.exports = uploadRouter;
