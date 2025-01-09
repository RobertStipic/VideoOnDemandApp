import express from 'express';
import { currentUser, userAuthorization } from '@robstipic/middlewares';
const PlayMovieRouter = express.Router();

PlayMovieRouter.get('/movies/playmovie', currentUser, userAuthorization,  (req, res) =>{

});

export {PlayMovieRouter};