const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/env');

function createToken(payload, exp) {
   return jwt.sign(payload, jwtSecret, { expiresIn: exp });
}

function checkToken(token) {
   return jwt.verify(token, jwtSecret);
}

module.exports = { createToken, checkToken };
