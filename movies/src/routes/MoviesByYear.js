import express from 'express';
import { body, validationResult } from 'express-validator';
import { currentUser, userAuthorization } from '@robstipic/middlewares';
import { Movie } from '../models/movies.js';


const MoviesByYearRouter = express.Router();

MoviesByYearRouter.get('/movies/moviesbyyear',  (req, res) =>{

});

export {MoviesByYearRouter};