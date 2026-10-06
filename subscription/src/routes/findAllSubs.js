import express from "express";
import { currentUser, adminAuthorization } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";

const findRouter = express.Router();

findRouter.get(
  "/subscription/findall",
  currentUser,
  adminAuthorization,
  async (res) => {
    try {
      const subscription = await Subscription.find({});
      console.log("subscription count:", subscription.length);

      res.status(200).send(subscription);
    } catch (error) {
      res.status(500).send("Error while retriving all subscriptions");
    }
  },
);

export { findRouter };
