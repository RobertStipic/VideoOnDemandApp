import express from "express";
import { userAuthorization } from "@robstipic/middlewares";
import { UserActivity } from "../models/user_activity.js";

const registrationDateRouter = express.Router();

registrationDateRouter.get(
  "/activity/registrationdate",
  userAuthorization,
  async (req, res) => {
    try{
    const userEmail = req.currentUser.email;

    const registrationActivity = await UserActivity.aggregate([
      { $match: { userEmail } },
      { $unwind: "$login_history" },
      { $match: { "login_history.activityType": "registration" } },
      { $limit: 1 },
      {
        $project: {
          registrationDate: "$login_history.loggedAt",
          _id: 0,
        },
      },
    ]);

    if (registrationActivity.length === 0) {
      return res.status(404).send({ message: "Registration date not found" });
    }

    res.send(registrationActivity[0]);
  }catch (error) {
     res.status(500).send("Error retriving user registration date");
    }
  }
);

export { registrationDateRouter };
