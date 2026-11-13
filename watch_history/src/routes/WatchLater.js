import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchLater } from "../models/watch_later.js";

const WatchLaterRouter = express.Router();

// POST - add new movie
WatchLaterRouter.post(
  "/history/watch-later/:movieId",
  userAuthorization,
  async (req, res) => {
    try {
      const { movieId } = req.params;

      const movie = await Movie.findOne({ movieId });
      if (!movie) {
        return res.status(404).send("Movie not found");
      }

      const existing = await WatchLater.findOne({
        userId: req.currentUser.id,
        movieId,
      });

      if (existing) {
        return res.status(409).send("Movie already in watch later");
      }

      await WatchLater.create({
        userId: req.currentUser.id,
        userEmail: req.currentUser.email,
        movieId,
      });

      res.status(201).send({ added: movieId });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send("Movie already in watch later");
      }
      res.status(500).send("Error adding to watch later");
    }
  },
);

// DELETE /watch-later/:movieId
WatchLaterRouter.delete(
  "/history/watch-later/:movieId",
  userAuthorization,
  async (req, res) => {
    try {
      const result = await WatchLater.deleteOne({
        userId: req.currentUser.id,
        movieId: req.params.movieId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).send("Movie not in watch later");
      }

      res.status(200).send({ removed: req.params.movieId });
    } catch (error) {
      res.status(500).send("Error removing from watch later");
    }
  },
);

// GET /watch-later — all watch later movies
WatchLaterRouter.get(
  "/history/watch-later",
  userAuthorization,
  async (req, res) => {
    try {
      const items = await WatchLater.find({
        userId: req.currentUser.id,
      })
        .sort({ addedAt: -1 })
        .lean();

      const result = [];
      for (const item of items) {
        const movieInfo = await Movie.findOne({
          movieId: item.movieId,
        })
          .select({
            Title: 1,
            Poster: 1,
            Year: 1,
            Runtime: 1,
            Genre: 1,
            imdbRating: 1,
            imdbID: 1,
            _id: 0,
          })
          .lean();

        if (movieInfo) {
          result.push({ ...item, ...movieInfo });
        }
      }

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Error fetching watch later");
    }
  },
);

// GET /watch-later/ids — get only ids for currentUser
WatchLaterRouter.get(
  "/history/watch-later/ids",
  userAuthorization,
  async (req, res) => {
    try {
      const items = await WatchLater.find(
        { userId: req.currentUser.id },
        { movieId: 1, _id: 0 },
      ).lean();

      res.status(200).send(items.map((item) => item.movieId));
    } catch (error) {
      res.status(500).send("Error fetching watch later ids");
    }
  },
);

export { WatchLaterRouter };
