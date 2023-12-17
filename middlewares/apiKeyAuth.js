const errorResponse = require('../utils/error');

const DEV_API_KEYS = [
   'Lgvlym3fomMA91VPvuIJFev1aV9IUnZ1vpAW8bdmOvwiVRCc/2yQq',
   'TGvi26e9EFJ/lrnOb77xLuES3E2iSz3MZ5.rb4JOwOH8MDW51LJF.',
   'NnSeOJT66nFRtf.SbkGUhu6PwJ4U41xLtJOiSSPjgLS9ffKTo7mNG',
];

const apiKeYAuth = (req, res, next) => {
   try {
      if (!req.query.api_key) {
         const error = errorResponse('unauthorized', 'api_key required');
         return res.status(error.statusCode).json(error);
      }
      if (!DEV_API_KEYS.includes(req.query.api_key)) {
         const error = errorResponse('unauthorized', 'api_key is invalid');
         return res.status(error.statusCode).json(error);
      }
      next();
   } catch (error) {
      throw error;
   }
};

module.exports = apiKeYAuth;
