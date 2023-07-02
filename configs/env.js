require('dotenv').config();

const env = {
   port: process.env.PORT || 4000,
   dbUri: process.env.DB_URI || process.env.DB_URI_DEV,
   jwtSecret: process.env.JWT_SECRET || process.env.JWT_SECRET_DEV,
   saltRounds: +process.env.ROUNDS || +process.env.ROUNDS_DEV,
};

module.exports = env;
