const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for handling files in memory

const upload = multer({
   storage: storage,
   limits: { fileSize: 5 * 1024 * 1024 }, // Set the file size limit to 5MB
});

function uploadMiddleware(fieldName) {
   if (typeof fieldName !== 'string') throw new Error('fieldName must be string');
   return upload.single(fieldName);
}

module.exports = uploadMiddleware;
