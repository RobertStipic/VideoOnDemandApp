import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { SubscriptionCreatedPublisher } from "../events/publisher/subscription-created-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { Subjects } from "../subjects/subjects.js";
import { calculateExpiration } from "../services/calculateSubscription.js";

const newSubRouter = express.Router();

newSubRouter.post(
  "/subscription/new",
  userAuthorization,
  [
    body("plan")
      .isInt({ min: 1, max: 3 })
      .withMessage("Valid plans are 1, 2, 3"),
    body("price").isInt({}).withMessage("Price must be a number"),
  ],
  async (req, res) => {
    const { plan, price, status } = req.body;
    const userId = req.currentUser.id;

    const expiresAtObj = calculateExpiration(plan);

    await Subscription.create({
      userId,
      expiresAt: expiresAtObj,
      plan,
      price,
      status,
    });

    const subscriptionObj = await Subscription.findOne({
      expiresAt: expiresAtObj,
    });

    await new SubscriptionCreatedPublisher(
      natsWrapperClient.client,
      Subjects.SubscriptionCreated
    ).publish({
      userId,
      plan,
      price,
      status,
      subscriptionId: subscriptionObj._id,
      expiresAt: subscriptionObj.expiresAt,
    });

    res.status(201).send({ subscriptionObj });
  }
);

export { newSubRouter };
