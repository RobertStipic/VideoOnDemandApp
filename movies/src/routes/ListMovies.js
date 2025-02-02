import express from 'express';
import { body, validationResult } from 'express-validator';
import { currentUser, userAuthorization } from '@robstipic/middlewares';
import { Movie } from '../models/movies.js';


const ListMoviesRouter = express.Router();
const temp_pagesize=10;
var temp_n = 0;

ListMoviesRouter.get('/movies/listmovies',  async (req, res) =>{
    if(temp_n<10){
    let movies = await Movie.find({},{Title:1, Plot: 1, Poster: 1}).skip(temp_pagesize*(temp_n)).limit(temp_pagesize);
       temp_n++;
    res.status(200).send(movies);
   
    
   
}
else res.status(200).send('All movies loaded');

});

export {ListMoviesRouter};