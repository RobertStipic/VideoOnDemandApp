import express from "express";
import {
  currentUser,
  userAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { MoviePlayedPublisher } from "../publishers/movie-played-publisher";
import { Movie } from "../models/movies";
const PlayMovieRouter = express.Router();

PlayMovieRouter.get(
  "/movies/watch/:id",
  currentUser,
  userAuthorization,
  async (req, res) => {
    const movie = await Movie.findOne({ imdbID: req.params.id });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    await new MoviePlayedPublisher(
      natsWrapperClient.jsClient,
      Subjects.MoviePlayed
    ).publish({
      movieId: req.params.id,
      email: req.currentUser.email,
    });
    res.status(200).send(movie);
  }
);

export { PlayMovieRouter };
