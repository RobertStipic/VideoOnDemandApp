import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { constants } from "../constants/general.js";
import { Movie } from "../models/movies.js";

const ListMoviesRouter = express.Router();

let temp_pagesize = constants.TEMP_PAGESIZE;
let temp_n = constants.TEMP_N;

ListMoviesRouter.get(
  "/movies/listmovies",
  userAuthorization,
  async (req, res) => {
    try{
    if (temp_n < 10) {
      let movies = await Movie.find({}, { Title: 1, Plot: 1, Poster: 1, _id: 0})
        .skip(temp_pagesize * temp_n)
        .limit(temp_pagesize);
      temp_n++;
      res.status(200).send(movies);
    } else res.status(200).send("All movies loaded");
  }catch (error) {
     res.status(500).send("Error listing movies");
    }
  }
);

export { ListMoviesRouter };
