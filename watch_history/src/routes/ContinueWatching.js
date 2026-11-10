import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchHistory } from "../models/watch_history.js";

const ContinueWatchingRouter = express.Router();

const MIN_PERCENT = 0.05; // 5%
const MAX_PERCENT = 0.95; // 95%

ContinueWatchingRouter.get(
  "/history/continue",
  userAuthorization,
  async (req, res) => {
    try {
      const userHistory = await WatchHistory.findOne({
        userId: req.currentUser.id,
      });

      if (!userHistory) {
        return res.status(200).send([]);
      }

      const latestByMovie = new Map();

      for (const watchedMovie of userHistory.watch_history) {
        const { position, duration, updatedAt } = watchedMovie.progress || {};

        if (!duration || duration === 0) continue;
        if (!updatedAt) continue;

        const percent = position / duration;
        if (percent <= MIN_PERCENT || percent >= MAX_PERCENT) continue;

        const existing = latestByMovie.get(watchedMovie.movieId);
        if (!existing || new Date(updatedAt) > new Date(existing.updatedAt)) {
          latestByMovie.set(watchedMovie.movieId, {
            movieId: watchedMovie.movieId,
            position,
            duration,
            percent: Math.round(percent * 100),
            updatedAt,
          });
        }
      }

      const result = [];
      for (const entry of latestByMovie.values()) {
        const movieInfo = await Movie.findOne({
          movieId: entry.movieId,
        })
          .select({ Title: 1, Poster: 1, Runtime: 1, _id: 0 })
          .lean();

        if (movieInfo) {
          result.push({ ...entry, ...movieInfo });
        }
      }

      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      res.status(200).send(result.slice(0, 3));
    } catch (error) {
      res.status(500).send("Error fetching continue watching");
    }
  },
);

export { ContinueWatchingRouter };
