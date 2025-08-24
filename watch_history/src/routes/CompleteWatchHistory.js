import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchHistory } from "../models/watch_history.js";

const CompleteHistoryRouter = express.Router();

CompleteHistoryRouter.get(
  "/history/complete/",
  userAuthorization,
  async (req, res) => {
    try {
      const watchHistory = await WatchHistory.find({});

      if (!watchHistory || watchHistory.length === 0) {
        return res.status(404).send("No watch history found");
      }

   
      const movieHistory = {};

      for (const userWatchHistory of watchHistory) {
        const userEmail = userWatchHistory.userEmail;
        movieHistory[userEmail] = [];

        for (const watchedMovie of userWatchHistory.watch_history) {
          const movieInfo = await Movie.findOne({ movieId: watchedMovie.movieId }).select({
            Title: 1,
            _id: 0,
          });

          const movieTitle = movieInfo;

          movieHistory[userEmail].push({
            movieId: watchedMovie.movieId,
            title: movieTitle, // Zamjenjuje title: movieTitle
            watchedAt: watchedMovie.watchedAt,
          });
        }
      }

      res.status(200).send(movieHistory);
    } catch (error) {
      res.status(500).send("Error fetching complete watch history");
    }
  }
);

export { CompleteHistoryRouter };