import express from 'express';
import { body, validationResult } from 'express-validator';
import { currentUser, userAuthorization } from '@robstipic/middlewares';
import { Movie } from '../models/movies.js';


const MoviesByGenreRouter = express.Router();

MoviesByGenreRouter.get('/movies/moviesbygenre', [
    body('genre')
    .exists({checkFalsy: true})
    .withMessage('Please provide movie genre')
    .isIn(["Drama", "Crime", "Action", "History", "Biography", "Action", "Adventure", "Western", "Romance", "Sci-Fi", "Mystery",
        "Fantasy", "Thriller", "Comedy", "Horror", "Animation", "Music", "War", "Family", "Film-Noir"
    ])
    .withMessage(`List of valid movie genres: Drama, Crime, Action, History, Biography, Action, Adventure, Western, Romance, Sci-Fi, Mystery,
        Fantasy, Thriller, Comedy, "Horror", Animation, Music, War, Family, Film-Noir`)
    ]
    ,currentUser, 
    userAuthorization, 
    async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
                return res.status(400).send(errors.array());
        }
        const {genre} = req.body;
        let movies = await Movie.find({"Genre": {"$regex": genre, "$options": "i"}},{Title:1, Genre: 1});
        res.status(200).send(movies);
    });

export {MoviesByGenreRouter};