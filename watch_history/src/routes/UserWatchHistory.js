import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchHistory } from "../models/watch_history.js";

const UserWatchHistoryRouter = express.Router();

UserWatchHistoryRouter.get(
  "/history/:userId",
  userAuthorization,
  async (req, res) => {
    const userWatchHistory = await WatchHistory.findOne({
      userId: req.params.userId,
    });
    const WatchHistoryUser = {};

    WatchHistoryUser[req.currentUser.email] = {
      userId: req.params.userId,
      movies: [],
    };

    for (const watchedMovie of userWatchHistory.watch_history) {
      const movieInfo = await Movie.findOne({ movieId: watchedMovie.movieId });
      const existingMovie = WatchHistoryUser[req.currentUser.email].movies.find(
        (movie) => movie.movieId === watchedMovie.movieId
      );
      if (existingMovie) {
        existingMovie.watchedAt.push(watchedMovie.watchedAt);
      } else {
        WatchHistoryUser[req.currentUser.email].movies.push({
          movieId: watchedMovie.movieId,
          title: movieInfo.Title,
          watchedAt: [watchedMovie.watchedAt],
        });
      }
    }
    res.status(200).send(WatchHistoryUser);
  }
);
export { UserWatchHistoryRouter };
