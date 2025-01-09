import express from 'express';
import { currentUser } from '@robstipic/middlewares';
import { userAuthorization } from '@robstipic/middlewares';
const CurrentUserRouter = express.Router();

CurrentUserRouter.get('/users/currentuser', currentUser, userAuthorization , (req, res) =>{

    res.send({currentUser : req.currentUser || null});
});

export {CurrentUserRouter};