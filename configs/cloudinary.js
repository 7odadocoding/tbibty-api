const { v2: cloudinary } = require('cloudinary');
const { cloudApiKey, cloudApiSecret, cloudName } = require('./env');

function connectCloud() {
   cloudinary.config({
      cloud_name: cloudName,
      api_key: cloudApiKey,
      api_secret: cloudApiSecret,
      signatureAlgorithm: 'sha256',
   });
}

module.exports = connectCloud;
