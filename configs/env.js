require('dotenv').config();

const env = {
   port: process.env.PORT || 4000,
   dbUri: process.env.DB_URI || process.env.DB_URI_DEV,
   dbName: process.env.DB_NAME || process.env.DB_NAME_DEV,
   jwtSecret: process.env.JWT_SECRET || process.env.JWT_SECRET_DEV,
   saltRounds: +process.env.ROUNDS || +process.env.ROUNDS_DEV,
   gmailUser: process.env.GMAIL_EMAIL,
   gmailPass: process.env.GMAIL_PASS,
};

module.exports = env;
