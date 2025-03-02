import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { User } from "../models/user.js";
const CurrentUserRouter = express.Router();

CurrentUserRouter.get(
  "/users/currentuser",
  currentUser,
  userAuthorization,
  async (req, res) => {
    const user = await User.findOne({
      email: req.currentUser.email,
    });
    res.send(user);
  }
);

export { CurrentUserRouter };
