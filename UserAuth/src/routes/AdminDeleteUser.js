import express from "express";
import {
  currentUser,
  adminAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { User } from "../models/user.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { AccountDeletedPublisher } from "../events/publishers/account-deleted-publisher.js";

const AdminDeleteUserRouter = express.Router();

AdminDeleteUserRouter.delete(
  "/users/admin/:id",
  currentUser,
  adminAuthorization,
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      if (user.id === req.currentUser.id) {
        return res.status(400).send("Cannot delete your own account");
      }

      if (user.role === "admin") {
        return res.status(400).send("Cannot delete another admin");
      }

      const tempId = user.id;
      await user.deleteOne();

      new AccountDeletedPublisher(
        natsWrapperClient.jsClient,
        Subjects.AccountDeleted,
      ).publish({ id: tempId });

      res.status(200).send({ deleted: tempId });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
    }
  },
);

export { AdminDeleteUserRouter };
