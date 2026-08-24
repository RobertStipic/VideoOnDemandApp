import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";

const AllUserSubsRouter = express.Router();

AllUserSubsRouter.get(
  "/subscription/user/all",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try{
    const subscription = await Subscription.find({
      userId: req.currentUser.id,
    });
    res.status(200).send(subscription);
    }catch (error) {
      res.status(500).send("Error while retriving all user subscriptions");
    }
  }
);

export { AllUserSubsRouter };
