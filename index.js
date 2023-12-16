const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const v1Routes = require('./routes/v1.router');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./configs/db');
const connectCloud = require('./configs/cloudinary');
const { port } = require('./configs/env');
// const apiLimiter = require('./middlewares/apiLimiter');
const ping = require('./middlewares/ping');
const app = express();

connectDB();
connectCloud()

// app.use(apiLimiter(50)); api limiter doesn't work as intended with helmet
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.get('/ping', ping);
app.use('/api/v1', v1Routes);
app.all('*', (req, res, next) => {
   let error = new Error('Path not found!');
   error.name = 'NotFound';
   next(error);
});
app.use(errorHandler);

app.listen(port, () => console.log(`app listening on port ${port}!`));
