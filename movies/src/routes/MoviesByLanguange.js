import express from 'express';
import { body, validationResult } from 'express-validator';

import { Movie } from '../models/movies.js';
const MoviesByLanguageRouter = express.Router();

MoviesByLanguageRouter.get('/movies/moviesbylanguage', [
body('language')
.exists({checkFalsy: true})
.withMessage('Please provide language')
.isIn(["English", "Italian", "Mandarin", "Latin", "Spanish", "Sicilian", " Hebrew",
    "Polish", "German", "Quenya", "Sindarin","French", "Japanese", "Czech", "Portuguese",
    "Swahili", "Xhosa", "Zhulu", "Hungarian", "Cantonese", "Vietnamese", "Arabic",
    "Nepali", "Hindi", "Esperanto", "Russian", "Korean", "Gaelic", "Yiddish", "Turkish",
    "Amharic", "Danish"
])
.withMessage(`List of valid languages: English, Italian, Mandarin, Latin, Spanish, German, French, Japanese, Russian, Sicilian, 
Hebrew, Polish, Quenya, Czech, Portuguese, Swahili, Xhosa, Zhulu, Hungarian, Cantonese, Vietnamese, Arabic, Nepali, Hindi,
Esperanto, Korean, Gaelic, Yiddish, Turkish, Amharic, Danish`)
]
,  async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
            return res.status(400).send(errors.array());
    }
    const {language} = req.body;
    let movies = await Movie.find({"Language": {"$regex": language, "$options": "i"}},{Title:1, Language: 1});
    res.status(200).send(movies);
});

export {MoviesByLanguageRouter};