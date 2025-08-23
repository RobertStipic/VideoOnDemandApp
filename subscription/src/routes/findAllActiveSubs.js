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
      console.log("error:", error);

      return res.status(404).send("Not Found");
    }
  }
);

export { activeSubsRouter };
