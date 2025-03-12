import express from "express";
import { Subscription } from "../models/subscription.js";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { constants } from "../consants/general.js";
import { SubscriptionCancelledPublisher } from "../events/publisher/subscription-cancelled-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";

const cancelSubRouter = express.Router();

cancelSubRouter.delete(
  "/subscription/remove/:id",
  userAuthorization,
  async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send("Subscription not found");
    }
    if (!subscription.userId.equals(req.currentUser.id)) {
      return res.status(401).send("Not authorized");
    }
    subscription.set({ status: constants.status.cancelled });
    await subscription.save();
    new SubscriptionCancelledPublisher(
      natsWrapperClient.client,
      Subjects.SubscriptionCancelled
    ).publish({
      subscriptionId: subscription._id,
      status: subscription.status,
    });
    res.status(200).send({ "Subscription cancelled": subscription.status });
  }
);

export { cancelSubRouter };
