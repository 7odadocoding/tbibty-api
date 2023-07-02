function successResponse(message = 'success', status = 200, data = null) {
   return {
      data,
      message,
      status,
      error: null,
   };
}

module.exports = successResponse;
