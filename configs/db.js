const mongoose = require('mongoose');
const env = require('./env');

const connectDB = () => {
   mongoose
      .connect(env.dbUri, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then((res) => {
         console.info(`connected to ${res.connections[0].name} database successfully ..`);
      })
      .catch((err) => {
         console.error('Failed to connect', err);
      });
};

module.exports = connectDB;
