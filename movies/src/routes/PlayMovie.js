import express from "express";
import {
  currentUser,
  userAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { natsWrapperClient } from "../nats-client.js";
import { MoviePlayedPublisher } from "../events/publishers/movie-played-publisher.js";
import { Movie } from "../models/movies.js";
import axios from "axios"; 

const PlayMovieRouter = express.Router();

PlayMovieRouter.get(
  "/movies/watch/:id",
  currentUser,
  userAuthorization,
  async (req, res) => {

    
    const movie = await Movie.findOne({ imdbID: req.params.id });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    const userInfo = { userId: req.currentUser.id };
    try {
      console.log("Checking subscription status for user:", userInfo.userId);
      const subscriptionStatus = await axios.get(
        `http://userauth-srv:3000/users/${userInfo.userId}/subscription`
      );
      const Response = subscriptionStatus.data;
      console.log("Subscription status for user", userInfo.userId, ":", Response);

      if (!Response.isSubscribed) {
        return res.status(403).send("Subscription not valid");
      }
    } catch (err) {
      return res.status(500).send("Error checking subscription status");
    }

    await new MoviePlayedPublisher(
      natsWrapperClient.jsClient,
      Subjects.MoviePlayed
    ).publish({
      movieId: req.params.id,
      userId: req.currentUser.id,
      userEmail: req.currentUser.email,
    });

    res.status(200).send(movie);
  }
);

export { PlayMovieRouter };