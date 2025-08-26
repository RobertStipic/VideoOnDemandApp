import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { User } from "../models/user.js";
const CurrentUserRouter = express.Router();

CurrentUserRouter.get(
  "/users/currentuser",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try{
    const user = await User.findOne({
      email: req.currentUser.email,
    });
    res.status(200).send(user);
    }catch (error) {
      res.status(500).send("Unexpected password change error");
    }
  }
);

export { CurrentUserRouter };
