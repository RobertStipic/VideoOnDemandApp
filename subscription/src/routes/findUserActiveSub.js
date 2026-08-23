import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { constants } from "../constants/general.js";

const UserActiveSubRouter = express.Router();

UserActiveSubRouter.get(
  "/subscription/user/active",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try{
    const subscription = await Subscription.findOne({
      userId: req.currentUser.id,
      status: constants.status.succeeded
    });
    res.status(200).send(subscription);
    }catch (error) {
      res.status(500).send("Error while retriving active subscription for user");
    }
  }
);

export { UserActiveSubRouter };
