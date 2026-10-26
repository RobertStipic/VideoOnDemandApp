import express from "express";
import { currentUser, adminAuthorization } from "@robstipic/middlewares";
import { User } from "../models/user.js";

const AdminListUsersRouter = express.Router();

AdminListUsersRouter.get(
  "/users/admin/all",
  currentUser,
  adminAuthorization,
  async (req, res) => {
    try {
      const users = await User.find(
        {},
        {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
          isActive: 1,
          isSubscribed: 1,
          _id: 1,
        },
      ).sort({ email: 1 });

      res.status(200).send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error listing users");
    }
  },
);

export { AdminListUsersRouter };
