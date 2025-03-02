import express from "express";
import { body, validationResult } from "express-validator";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { SubscriptionUpdatedPublisher } from "../events/publisher/subscription-updated-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { calculateExpiration } from "../services/calculateSubscription.js";

const updateSubRouter = express.Router();

updateSubRouter.put(
  "/subscription/update/:id",
  userAuthorization,
  [
    body("plan")
      .isInt({ min: 1, max: 3 })
      .withMessage("Valid plans are 1, 2, 3"),
    body("price").isInt({}).withMessage("Price must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).send("Subscription not found");
    }
    if (!subscription.userId.equals(req.currentUser.id)) {
      return res.status(401).send("Not authorized");
    }
    const { plan, price } = req.body;
    console.log(subscription.expiresAt);
    const expiresAtObj = calculateExpiration(
      plan,
      subscription.expiresAt.getTime()
    );
    subscription.set({ plan, price, expiresAt: expiresAtObj });
    await subscription.save();
    const updatedSubscription = await Subscription.findById(req.params.id);
    await new SubscriptionUpdatedPublisher(
      natsWrapperClient.client,
      Subjects.SubscriptionUpdated
    ).publish({
      userId: updatedSubscription.userId,
      plan: updatedSubscription.plan,
      price: updatedSubscription.price,
      subscriptionId: updatedSubscription._id,
      expiresAt: updatedSubscription.expiresAt,
    });
    res.status(200).send(updatedSubscription);
  }
);

export { updateSubRouter };
