import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchHistory } from "../models/watch_history.js";

const FullMovieHistory = express.Router();

FullMovieHistory.get(
  "/history/full/:movieId",
  userAuthorization,
  async (req, res) => {
    const movieId = req.params.movieId;
    const movieInfo = await Movie.findOne({ movieId });

    if (!movieInfo) {
      return res.status(404).send("Movie not found");
    }

    const movieTitle = movieInfo.Title;
    const watchHistory = await WatchHistory.find({
      "watch_history.movieId": movieId,
    });
    if (!watchHistory) {
      return res
        .status(404)
        .send("Watch history not found for movie, ", movieTitle);
    }

    const movieHistory = {};

    watchHistory.forEach((userWatchHistory) => {
      const userEmail = userWatchHistory.userEmail;
      const userWatchHistoryForMovie = userWatchHistory.watch_history.filter(
        (watchedMovie) => watchedMovie.movieId === movieId
      );

      userWatchHistoryForMovie.forEach((watchedMovie) => {
        if (!movieHistory[movieTitle]) {
          movieHistory[movieTitle] = [];
        }
        movieHistory[movieTitle].push({
          userEmail: userEmail,
          watchedAt: watchedMovie.watchedAt,
        });
      });
    });

    res.status(200).send(movieHistory);
  }
);

export { FullMovieHistory };
