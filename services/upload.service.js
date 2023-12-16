const cloudinary = require('cloudinary');
const { cloudApiSecret } = require('../configs/env');
const CustomError = require('../utils/customError');

class UploadService {
   constructor(cloud) {
      this.cloud = cloud;
   }
   async uploadUserImage(image) {
      try {
         const b64 = Buffer.from(image.buffer).toString('base64');
         const dataURI = 'data:' + image.mimetype + ';base64,' + b64;
         const { secure_url, public_id } = await cloudinary.v2.uploader.upload(dataURI, { folder: 'user_images' });
         return { secure_url, public_id };
      } catch (error) {
         throw error;
      }
   }
   async destroyImage(publicId) {
      try {
         const { result } = await cloudinary.v2.uploader.destroy(publicId);
         if (result == 'not found') {
            throw new CustomError("Image does't exist", 'notFound');
         }
         return result;
      } catch (error) {
         throw error;
      }
   }
}

module.exports = new UploadService(cloudinary);
