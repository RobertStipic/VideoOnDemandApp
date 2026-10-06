import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  imdbID: { type: String, required: true },
  Path: { type: String, required: true },
  Title: { type: String, required: true },
});

export const Movie = mongoose.model("Movies", MovieSchema);
