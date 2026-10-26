import express from "express";
import {
  currentUser,
  adminAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { natsWrapperClient } from "../nats-wrapper.js";
import { MovieDeletedPublisher } from "../events/publishers/movie-deleted-publisher.js";

const deleteMovieRouter = express.Router();

deleteMovieRouter.delete(
  "/movies-admin/delete/:imdbID",
  currentUser,
  adminAuthorization,
  async (req, res) => {
    const { imdbID } = req.params;

    if (!imdbID || !/^tt\d+$/.test(imdbID)) {
      return res.status(400).send("Invalid imdbID");
    }

    await new MovieDeletedPublisher(
      natsWrapperClient.jsClient,
      Subjects.MovieDeleted,
    ).publish({ imdbID });

    res.status(200).send({ deleted: imdbID });
  },
);

export { deleteMovieRouter };
