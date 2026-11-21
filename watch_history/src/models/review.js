import mongoose from "mongoose";
import { Movie } from "./movie.js";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

ReviewSchema.index({ movieId: 1, createdAt: -1 });

async function updateMovieAverage(movieId) {
  const stats = await mongoose.model("Review").aggregate([
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
    await Movie.updateOne({ movieId }, { averageRating: 0, reviewCount: 0 });
  }
}

ReviewSchema.post("save", function () {
  updateMovieAverage(this.movieId).catch(console.error);
});

ReviewSchema.post("findOneAndUpdate", function (doc) {
  if (doc) updateMovieAverage(doc.movieId).catch(console.error);
});

const Review = mongoose.model("Review", ReviewSchema);

export { Review };
