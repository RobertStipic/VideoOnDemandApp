import express from "express";
import { WatchHistory } from "../models/watch_history.js";
import { Movie } from "../models/movie.js";

const TrendingRouter = express.Router();

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const LIMIT = 10;

TrendingRouter.get("/history/trending", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

    const trending = await WatchHistory.aggregate([
      { $unwind: "$watch_history" },
      {
        $match: {
          "watch_history.watchedAt": { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: "$watch_history.movieId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: LIMIT },
    ]);

    const result = [];
    for (const entry of trending) {
      const movieInfo = await Movie.findOne({
        movieId: entry._id,
      })
        .select({ Title: 1, Poster: 1, Year: 1, Runtime: 1, _id: 0 })
        .lean();

      if (movieInfo) {
        result.push({
          movieId: entry._id,
          count: entry.count,
          ...movieInfo,
        });
      }
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error fetching trending movies");
  }
});

export { TrendingRouter };
