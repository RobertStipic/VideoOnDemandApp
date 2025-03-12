import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
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
    if (!userWatchHistory) {
      return res.status(404).send("Watch history not found for user");
    }
    const watchedMovies = {};

    for (const watchedMovie of userWatchHistory.watch_history) {
      const movieInfo = await Movie.findOne({ movieId: watchedMovie.movieId });
      const existingMovie = watchedMovies[watchedMovie.movieId];
      if (!movieInfo) {
        return res.status(404).send("Movie not found");
      }
      if (existingMovie) {
        existingMovie.watchedAt.push(watchedMovie.watchedAt);
      } else {
        watchedMovies[watchedMovie.movieId] = {
          movieId: watchedMovie.movieId,
          title: movieInfo.Title,
          watchedAt: [watchedMovie.watchedAt],
        };
      }
    }

    const userEmail = userWatchHistory.userEmail;
    const response = {
      [userEmail]: Object.values(watchedMovies),
    };

    res.status(200).send(response);
  }
);
export { UserWatchHistoryRouter };
