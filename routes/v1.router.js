const { API_RUNNING } = require('../configs/responses');
const areaRouter = require('./area.router');
const authRouter = require('./auth.router');
const clinicRouter = require('./clinics.router');
const commentRouter = require('./comments.router');
const mainRouter = require('express').Router();

mainRouter.get('/', (req, res) => res.send(API_RUNNING));
mainRouter.use('/auth', authRouter);
mainRouter.use('/clinics', clinicRouter);
mainRouter.use('/comments', commentRouter);
mainRouter.use('/area', areaRouter);

module.exports = mainRouter;

/* for testing authorization
const authenticate = require('../middlewares/authentication');
const authorizeByRole = require('../middlewares/authorization');
const { getUserRole } = require('../services/auth.services');

mainRouter.get('/moderator', authenticate, authorizeByRole('MODERATOR', getUserRole), (req, res) => {
   try {
      res.send(`<pre style="font-family:"sans-serif";">Welcome moderator: ${req.user.fullname}!</pre>`);
   } catch (error) {
      console.log(error);
      next(error);
   }
});
*/
