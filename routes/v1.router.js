const { API_RUNNING } = require('../configs/responses');
const areaRouter = require('./area.router');
const articleRouter = require('./article.router');
const authRouter = require('./auth.router');
const clinicRouter = require('./clinics.router');
const homeRouter = require('./home.router');
const reviewRouter = require('./review.router');
const userRouter = require('./user.router');
const mainRouter = require('express').Router();

mainRouter.get('/', (req, res) => res.send(API_RUNNING));
mainRouter.use('/auth', authRouter);
mainRouter.use('/clinics', clinicRouter);
mainRouter.use('/area', areaRouter);
mainRouter.use('/user', userRouter);
mainRouter.use('/home', homeRouter);
mainRouter.use('/reviews', reviewRouter);
mainRouter.use('/articles', articleRouter);

module.exports = mainRouter;
