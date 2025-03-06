import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { UserActivity } from "../models/user_activity.js";
const userActivityRouter = express.Router();

userActivityRouter.get(
  "/activity/useractivity",
  userAuthorization,
  async (req, res) => {
    const userEmail = req.currentUser.email;

    const activity = await UserActivity.findOne({ userEmail }).select({
      _id: 0,
      __v: 0,
    });

    if (!activity) {
      return res.status(404).send({ message: "No activity found" });
    }

    res.send(activity);
  }
);

export { userActivityRouter };
