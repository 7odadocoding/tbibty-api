const { API_RUNNING } = require('../configs/responses');
const authRouter = require('./auth.router');
const clinicRouter = require('./clinics.router');
const commentRouter = require('./comments.router');
const mainRouter = require('express').Router();

mainRouter.get('/', (req, res) => res.send(API_RUNNING));
mainRouter.use('/auth', authRouter);
mainRouter.use('/clinics', clinicRouter);
mainRouter.use('/comments', commentRouter);

// const authenticate = require('../middlewares/authentication');
// const authorizeByRole = require('../middlewares/authorization');
// const { getUserRole } = require('../services/auth.services');
// for testing authorization
// mainRouter.get('/moderator', authenticate, authorizeByRole('MODERATOR', getUserRole), (req, res) => {
//    try {
//       res.send(`<pre style="font-family:"sans-serif";">Welcome moderator: ${req.user.fullname}!</pre>`);
//    } catch (error) {
//       console.log(error);
//       next(error);
//    }
// });

module.exports = mainRouter;
