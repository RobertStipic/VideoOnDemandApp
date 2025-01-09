import express from 'express';
import { currentUser } from '../../middlewares/current_user.js';
import { userAuthorization } from '../../middlewares/user_authorization .js';
const CurrentUserRouter = express.Router();

CurrentUserRouter.get('/users/currentuser', currentUser, userAuthorization , (req, res) =>{

    res.send({currentUser : req.currentUser || null});
});

export {CurrentUserRouter};