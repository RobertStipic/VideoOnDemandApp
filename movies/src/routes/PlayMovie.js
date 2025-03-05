import express from "express";
import {
  currentUser,
  userAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { MoviePlayedPublisher } from "../publishers/movie-played-publisher.js";
import { Movie } from "../models/movies.js";
import { natsWrapperClient } from "../nats-client.js";
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
      userId: req.currentUser.id,
    });

    res.status(200).send(movie);
  }
);

export { PlayMovieRouter };
