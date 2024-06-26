const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/env');

function createToken(payload, exp) {
   try {
      return jwt.sign(payload, jwtSecret, { expiresIn: exp });
   } catch (error) {
      throw error;
   }
}

function checkToken(token) {
   try {
      if (!token) throw new Error('token is required');
      const user = jwt.verify(token, jwtSecret);
      return user;
   } catch (error) {
      throw error;
   }
}

module.exports = { createToken, checkToken };
