import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { Review } from "../models/review.js";
import { Movie } from "../models/movie.js";

const ReviewRouter = express.Router();

ReviewRouter.post("/reviews/:movieId", userAuthorization, async (req, res) => {
  try {
    const { movieId } = req.params;
    const { rating, text } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).send("Rating must be between 1 and 5");
    }

    const review = await Review.findOneAndUpdate(
      { userId: req.currentUser.id, movieId },
      {
        userEmail: req.currentUser.email,
        rating,
        text: text || "",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving review");
  }
});

ReviewRouter.get("/reviews/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 })
      .lean();

    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
      averageRating = (sum / reviews.length).toFixed(1);
    }

    res.status(200).send({ averageRating, reviews });
  } catch (error) {
    res.status(500).send("Error fetching reviews");
  }
});

ReviewRouter.get(
  "/reviews/:movieId/me",
  userAuthorization,
  async (req, res) => {
    try {
      const review = await Review.findOne({
        userId: req.currentUser.id,
        movieId: req.params.movieId,
      }).lean();

      res.status(200).send(review || null);
    } catch (error) {
      res.status(500).send("Error fetching user review");
    }
  },
);

ReviewRouter.delete(
  "/reviews/:movieId",
  userAuthorization,
  async (req, res) => {
    try {
      const { movieId } = req.params;
      const result = await Review.deleteOne({
        userId: req.currentUser.id,
        movieId,
      });

      if (result.deletedCount === 0) {
        return res.status(404).send("Review not found");
      }

      const stats = await Review.aggregate([
        { $match: { movieId } },
        {
          $group: {
            _id: "$movieId",
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await Movie.updateOne(
          { movieId },
          {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            reviewCount: stats[0].count,
          },
        );
      } else {
        await Movie.updateOne(
          { movieId },
          { averageRating: 0, reviewCount: 0 },
        );
      }

      res.status(200).send({ deleted: true });
    } catch (error) {
      res.status(500).send("Error deleting review");
    }
  },
);

export { ReviewRouter };
