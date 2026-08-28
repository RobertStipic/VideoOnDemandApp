import express from "express";
import { Movie } from "../models/movies.js";

const ListMoviesRouter = express.Router();

ListMoviesRouter.get(
  "/movies/listmovies",
  async (req, res) => {
    try{
      let movies = await Movie.find({}, { _id: 0});
      res.status(200).send(movies);
  }catch (error) {
     res.status(500).send("Error listing movies");
    }
  }
);

export { ListMoviesRouter };
