import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { UserActivity } from "../models/user_activity.js";

const lastActivityRouter = express.Router();

lastActivityRouter.get(
  "/activity/lastactivity",
  userAuthorization,
  async (req, res) => {
    try{
    const userEmail = req.currentUser.email;

    const activity = await UserActivity.aggregate([
      { $match: { userEmail } },
      { $unwind: "$login_history" },
      { $sort: { "login_history.loggedAt": -1 } },
      { $limit: 1 },
      {
        $project: {
          activityType: "$login_history.activityType",
          loggedAt: "$login_history.loggedAt",
          _id: 0,
        },
      },
    ]);

    if (activity.length === 0) {
      return res.status(404).send({ message: "No activity found" });
    }

    res.send(activity[0]);
  }catch (error) {
     res.status(500).send("Error retriving last user activity");
    }
  }
);

export { lastActivityRouter };
