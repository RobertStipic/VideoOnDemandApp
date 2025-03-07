import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movies.js";
import { requestGenres } from "../constants/general.js";

const MoviesByGenreRouter = express.Router();

MoviesByGenreRouter.get(
  "/movies/moviesbygenre",
  [
    body(requestGenres.genre)
      .exists({ checkFalsy: true })
      .withMessage("Please provide movie genre")
      .isIn(requestGenres.genresArray)
      .withMessage(requestGenres.genresMessage),
  ],
  currentUser,
  userAuthorization,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { genre } = req.body;
    let movies = await Movie.find(
      { Genre: { $regex: genre, $options: "i" } },
      { Title: 1, Genre: 1 }
    );
    res.status(200).send(movies);
  }
);

export { MoviesByGenreRouter };
