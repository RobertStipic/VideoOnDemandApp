import express from 'express';
import { body, validationResult } from 'express-validator';
import { currentUser, userAuthorization } from '@robstipic/middlewares';
import { Movie } from '../models/movies.js';


const MoviesByYearRouter = express.Router();

MoviesByYearRouter.get('/movies/moviesbyyear', [
body('year')
.isInt({min: 1931, max:2021})
.withMessage('Valid start year values: 1931-2021'),
body('startyear')
.isInt({min: 1931, max:2021})
.withMessage('Valid start year values: 1931-2021'),
body('endyear')
.isInt({min: 1931, max:2021})
.withMessage('Valid start year values: 1931-2021')
]
,currentUser, 
userAuthorization, 
async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
            return res.status(400).send(errors.array());
    }
    const {year, startyear, endyear} = req.body;

    if(year && startyear || endyear){
        res.status(400).send("You can filter only by year, or startyear-endyear(valid values: 1931:2021)")
    }
    else if(year && !startyear && !endyear){
        let movies = await Movie.find({"Year": {$where: year}},{Title:1, Year: 1});
        res.status(200).send(movies);
    }
    else if(year && !startyear && !endyear){
        let movies = await Movie.find({"Year": {$gte: startyear, $lte: endyear}},{Title:1, Year: 1});
        res.status(200).send(movies);
    }

    let movies = await Movie.find({"Year": {"$regex": language, "$options": "i"}},{Title:1, Language: 1});
    res.status(200).send(movies);
});
export {MoviesByYearRouter};