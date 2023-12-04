const { compare, hash, genSalt } = require('bcrypt');
const { saltRounds } = require('../configs/env');

async function hashPassword(password) {
   let salt = await genSalt(saltRounds);
   let hashedPassword = await hash(password, salt);
   return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
   let isEqual = await compare(password, hashedPassword);
   return isEqual;
}

function generateOTP() {
   const otp = Math.floor(100000 + Math.random() * 900000);
   return otp.toString();
}

module.exports = { hashPassword, checkPassword, generateOTP };
