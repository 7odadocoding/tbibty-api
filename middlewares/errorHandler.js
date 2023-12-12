const errorResponse = require('../utils/error');

const errorHandler = (err, req, res, next) => {
   if (err) {
      console.log('Error:' , err);
      if (err.name === 'ValidationError') {
         let error = errorResponse('conflict', err.message);
         return res.status(error.statusCode).json(error);
      }

      if (err.name === 'NotFound') {
         let error = errorResponse('notFound', err.message);
         console.log(error);
         return res.status(error.statusCode).json(error);
      }

      if (err.name === 'DatabaseError' || err.name === 'MongoServerError') {
         let error = errorResponse('conflict', 'data conflict error');
         return res.status(error.statusCode).json(error);
      }
      let error = errorResponse(err.name || 'internal', err.message || 'error occurred');
      return res.status(error.statusCode).json(error);
   }
};

module.exports = errorHandler;
