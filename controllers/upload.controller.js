const CustomError = require('../utils/customError');
const uploadService = require('../services/upload.service');
const successResponse = require('../utils/success');

class UploadController {
   constructor() {
      this.service = uploadService;
   }
   async uploadUserImage(req, res, next) {
      try {
         if (!req.file) {
            throw new CustomError('No file uploaded', 'badRequest');
         }
         const result = await uploadService.uploadUserImage(req.file);
         const response = successResponse('image uploaded successfully', 201, result);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }

   async destroyImage(req, res, next) {
      try {
         const { publicId } = req.body;
         const result = await uploadService.destroyImage(publicId);
         const response = successResponse('image deleted successfully', 201, result);
         res.status(response.status).json(response);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new UploadController();
