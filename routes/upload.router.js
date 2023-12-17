const uploadController = require('../controllers/upload.controller');
const apiKeYAuth = require('../middlewares/apiKeyAuth');
const uploadMiddleware = require('../middlewares/multer');

const uploadRouter = require('express').Router();

uploadRouter.post('/user', uploadMiddleware('user-image'), uploadController.uploadUserImage.bind(uploadController));
uploadRouter.delete('/destroy', apiKeYAuth, uploadController.destroyImage.bind(uploadController));

module.exports = uploadRouter;
