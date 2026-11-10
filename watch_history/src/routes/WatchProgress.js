import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { WatchHistory } from "../models/watch_history.js";

const ProgressRouter = express.Router();

ProgressRouter.post(
  "/history/progress",
  userAuthorization,
  async (req, res) => {
    try {
      const { movieId, position, duration } = req.body;

      if (
        !movieId ||
        typeof position !== "number" ||
        typeof duration !== "number"
      ) {
        return res.status(400).send("movieId, position and duration required");
      }

      const userHistory = await WatchHistory.findOne({
        userId: req.currentUser.id,
      });

      if (!userHistory) {
        return res.status(404).send("Watch history not found for user");
      }

      const entry = userHistory.watch_history.find(
        (watchedMovie) => watchedMovie.movieId === movieId,
      );

      if (!entry) {
        return res.status(404).send("Movie not in watch history");
      }

      entry.progress = {
        position,
        duration,
        updatedAt: new Date(),
      };

      await userHistory.save();
      res.status(200).send({ movieId, position, duration });
    } catch (error) {
      res.status(500).send("Error saving progress");
    }
  },
);

ProgressRouter.get(
  "/history/progress/:movieId",
  userAuthorization,
  async (req, res) => {
    try {
      const userHistory = await WatchHistory.findOne({
        userId: req.currentUser.id,
      });

      if (!userHistory) {
        return res.status(200).send({ position: 0, duration: 0 });
      }

      const entry = userHistory.watch_history.find(
        (watchedMovie) => watchedMovie.movieId === req.params.movieId,
      );

      res.status(200).send({
        position: entry?.progress?.position || 0,
        duration: entry?.progress?.duration || 0,
      });
    } catch (error) {
      res.status(500).send("Error fetching progress");
    }
  },
);

export { ProgressRouter };
