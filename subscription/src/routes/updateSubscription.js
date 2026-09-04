import express from "express";
import { body, validationResult } from "express-validator";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { SubscriptionCreatedPublisher } from "../events/publisher/subscription-created-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { constantsUpdateSub, constants, calculatePrice } from "../constants/general.js";
import {
  calculateExpiration,
  calculatePaymentExpiration,
} from "../services/calculateSubscription.js";

const updateSubRouter = express.Router();

updateSubRouter.put(
  "/subscription/extend/:id",
  userAuthorization,
  [
    body(constantsUpdateSub.plan)
      .isInt({ min: 1, max: 3 })
      .withMessage(constantsUpdateSub.planMessage),
  ],
  async (req, res) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const oldSubscription = await Subscription.findById(req.params.id);
    if (!oldSubscription) {
      return res.status(404).send("Subscription not found");
    }
    if (!oldSubscription.userId.equals(req.currentUser.id)) {
      return res.status(401).send("Not authorized");
    }
    if (oldSubscription.status !== constants.status.succeeded) {
      return res.status(400).send("Subscription can only be updated when status is succeeded status");
    }
    const { plan } = req.body;
    const price = calculatePrice(plan);
    
    const expiresAt = calculateExpiration(
      plan,
      oldSubscription.expiresAt.getTime()
    );
    const paymentExpiresAt = calculatePaymentExpiration();
    const newSubscription = await Subscription.create({
      userId: req.currentUser.id,
      userEmail: req.currentUser.email,
      plan,
      price,
      paymentExpiresAt,
      expiresAt,
      status: constants.status.pending,
    });

    await new SubscriptionCreatedPublisher(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCreated
    ).publish({
      userId: newSubscription.userId,
      plan,
      price,
      subscriptionId: newSubscription._id,
      expiresAt,
      userEmail: newSubscription.userEmail,
      status: newSubscription.status,
      paymentExpiresAt,
    });
    res.status(200).send({ subscriptionObj: newSubscription });
  }catch (error) {
     res.status(500).send("Error while updating subscription");
    }
  }
);

export { updateSubRouter };
