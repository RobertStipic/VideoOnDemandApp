import express from "express";
import { adminAuthorization, Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "../nats-wrapper.js";
import { MovieDeletedPublisher } from "../events/publishers/movie-deleted-publisher.js";
import { AdminActionPublisher } from "../events/publishers/admin-action-publisher.js";

const deleteMovieRouter = express.Router();

deleteMovieRouter.delete(
  "/movies-admin/delete/:imdbID",
  adminAuthorization,
  async (req, res) => {
    try {
      const { imdbID } = req.params;

      if (!imdbID || !/^tt\d+$/.test(imdbID)) {
        return res.status(400).send("Invalid imdbID");
      }

      await new MovieDeletedPublisher(
        natsWrapperClient.jsClient,
        Subjects.MovieDeleted,
      ).publish({ imdbID });

      await new AdminActionPublisher(
        natsWrapperClient.jsClient,
        Subjects.AdminActionLogged,
      ).publish({
        adminEmail: req.currentUser.email,
        action: "movie:delete",
        service: "movies-admin",
        targetId: imdbID,
        details: { imdbID },
        timestamp: new Date().toISOString(),
      });

      res.status(200).send({ deleted: imdbID });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting movie");
    }
  },
);

export { deleteMovieRouter };
