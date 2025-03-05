import mongoose from "mongoose";

const MoviesSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    Runtime: {
      type: String,
      required: true,
    },
    Poster: {
      type: String,
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Movie = mongoose.model("Movies", MoviesSchema);

export { Movie };
