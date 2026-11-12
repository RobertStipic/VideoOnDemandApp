import express from "express";
import { Movie } from "../models/movies.js";

const RecentlyAddedRouter = express.Router();

RecentlyAddedRouter.get("/movies/recent", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const movies = await Movie.find(
      { createdAt: { $exists: true } },
      {
        _id: 0,
        Title: 1,
        Year: 1,
        Runtime: 1,
        Genre: 1,
        Plot: 1,
        Poster: 1,
        imdbRating: 1,
        Actors: 1,
        Language: 1,
        imdbID: 1,
        createdAt: 1,
      },
    )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).send(movies);
  } catch (error) {
    res.status(500).send("Error fetching recently added movies");
  }
});

export { RecentlyAddedRouter };
