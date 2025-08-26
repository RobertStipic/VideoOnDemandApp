import express from "express";
import { body } from "express-validator";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { SubscriptionCreatedPublisher } from "../events/publisher/subscription-created-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import {
  calculateExpiration,
  calculatePaymentExpiration,
} from "../services/calculateSubscription.js";
import { constants, constantsNewSub, calculatePrice } from "../constants/general.js";

const newSubRouter = express.Router();

newSubRouter.post(
  "/subscription/new",
  userAuthorization,
  [
    body(constantsNewSub.plan)
      .isInt({ min: constants.plan.min, max: constants.plan.max })
      .withMessage(constantsNewSub.planMessage)
  ],
  async (req, res) => {
    try{
    const { plan, status } = req.body;
    const userId = req.currentUser.id;

    const expiresAt = calculateExpiration(plan);
    const paymentExpiresAt = calculatePaymentExpiration();
    const price = calculatePrice(plan);
    const subscriptionObj = await Subscription.create({
      userId,
      expiresAt,
      paymentExpiresAt,
      plan,
      price,
      status,
      userEmail: req.currentUser.email,
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
      expiresAt,
      paymentExpiresAt,
      userEmail: subscriptionObj.email,
    });

    res.status(201).send({ subscriptionObj });
  }catch (error) {
     res.status(500).send("Error while creating new subscription");
    }
  }
);

export { newSubRouter };
