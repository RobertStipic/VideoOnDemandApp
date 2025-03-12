import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import * as path from "path";
import { fileURLToPath } from "url";
import { Movie } from "../models/movies.js";

const SendMovieRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
SendMovieRouter.get("/movies/:id", userAuthorization, async (req, res) => {
  const movie = await Movie.findOne({ imdbID: req.params.id }, { imdbID: 1 });
  if (!movie) {
    return res.status(404).send("Movie not found");
  }
  const movieLocation = path.join(
    __dirname,
    "..",
    "output",
    movie.imdbID,
    movie.imdbID + ".mpd"
  );
  res.status(200).sendFile(movieLocation);
});

export { SendMovieRouter };
