const boom = require('@hapi/boom');

function errorResponse(error = 'internal', message = null) {
   const errors = {
      internal: (message) => boom.internal(message),
      badRequest: (message) => boom.badRequest(message),
      forbidden: (message) => boom.forbidden(message),
      unauthorized: (message) => boom.unauthorized(message),
      notFound: (message) => boom.notFound(message),
      conflict: (message) => boom.conflict(message),
   };
   let output = errors[error](message).output;
   return {
      statusCode: output.statusCode,
      ...output.payload,
   };
}

module.exports = errorResponse;
