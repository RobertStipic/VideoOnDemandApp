import express from "express";
import { User } from "../models/user.js";
import { userAuthorization, currentUser } from "@robstipic/middlewares";
const SubscriptionStatusRouter = express.Router();

SubscriptionStatusRouter.get("/users/:id/subscription",
  currentUser, 
  userAuthorization,
  async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send({ isSubscribed: user.isSubscribed });
  } catch (err) {
    res.status(500).send("Unexpected checking subscription error");
  }
});

export { SubscriptionStatusRouter };