const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/index.router');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./configs/db');
const { port } = require('./configs/env');
const apiLimiter = require('./middlewares/apiLimiter');
const app = express();

connectDB();

app.use(apiLimiter(50));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use('/api', mainRouter);
app.all('*', (req, res, next) => {
   let error = new Error('Path not found!');
   error.name = 'NotFound';
   next(error);
});
app.use(errorHandler);

app.listen(port, () => console.log(`app listening on port ${port}!`));
