import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { constants } from "../constants/general.js";

const activeSubsRouter = express.Router();
activeSubsRouter.get(
  "/subscription/findall/active",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try {
      const subscription = await Subscription.find({
        status: constants.status.succeeded,
      });
      console.log("active subscription count:", subscription.length);

      res.status(200).send(subscription);
    } catch (error) {
       res.status(500).send("Error while retriving all active subscriptions");
    }
  }
);

export { activeSubsRouter };
