import express from "express";
import { query, validationResult } from "express-validator";
import { Movie } from "../models/movies.js";
import { requestGenres, requestLanguages, constantsMovieFilter } from "../constants/general.js";

const MoviesFilterRouter = express.Router();

MoviesFilterRouter.get(
  "/movies/filter",
  [
    query(constantsMovieFilter.genre)
      .optional()
      .isIn(requestGenres.genresArray)
      .withMessage(constantsMovieFilter.genreMessage),
    query(constantsMovieFilter.language)
      .optional()
      .isIn(requestLanguages.languagesArray)
      .withMessage(constantsMovieFilter.languageMessage),
    query(constantsMovieFilter.year)
      .optional()
      .isInt({ min: constantsMovieFilter.minValue, max: constantsMovieFilter.maxValue })
      .withMessage(constantsMovieFilter.yearMessage),
    query(constantsMovieFilter.startyear)
      .optional()
      .isInt({ min: constantsMovieFilter.minValue, max: constantsMovieFilter.maxValue })
      .withMessage(constantsMovieFilter.startYearMessage),
    query(constantsMovieFilter.endyear)
      .optional()
      .isInt({ min: constantsMovieFilter.minValue, max: constantsMovieFilter.maxValue })
      .withMessage(constantsMovieFilter.endYearMessage),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      const { genre, language, year, startyear, endyear } = req.query;

      if (year && (startyear || endyear)) {
        res.status(400)
        .send(
          [{ msg: `You can filter only by Year, or Start Year-End Year. Valid values are from: ${requestYears.minValue} to ${requestYears.maxValue}`}]
        )};
      if (startyear > endyear) {
        res.status(400)
        .send(
          [{msg: `Start Year must be lower than End Year. Valid values are from: ${requestYears.minValue} to ${requestYears.maxValue})`}]
        )}; 
      const filter = {};

      if (genre) filter.Genre = { $regex: genre, $options: "i" };
      if (language) filter.Language = { $regex: language, $options: "i" };

      if (year) {
        filter.Year = year;
      } else if (startyear && endyear) {
        filter.Year = { $gte: startyear, $lte: endyear };
      } else if (startyear) {
        filter.Year = { $gte: startyear };
      } else if (endyear) {
        filter.Year = { $lte: endyear };
      }


      const movies = await Movie.find(filter, 
      { _id:0, Title: 1, Language: 1, Year: 1, Poster:1, Runtime:1, Genre: 1,
        Plot: 1, imdbRating: 1, Actors: 1, imdbID: 1 });

      res.status(200).send(movies);
    } catch (error) {
      res.status(500).send("Error while filtering movies");
    }
  }
);

export { MoviesFilterRouter };