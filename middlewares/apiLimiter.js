const { rateLimit } = require('express-rate-limit');

const apiLimiter = (rpm = 100) => {
   return rateLimit({
      windowMs: 60 * 1000,
      max: rpm,
      standardHeaders: true,
      legacyHeaders: false,
   });
};

module.exports = apiLimiter;
