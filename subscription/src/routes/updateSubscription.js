import express from "express";
import { body, validationResult } from "express-validator";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { SubscriptionUpdatedPublisher } from "../events/publisher/subscription-updated-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { constantsUpdateSub, constants, calculatePrice } from "../consants/general.js";
import {
  calculateExpiration,
  calculatePaymentExpiration,
} from "../services/calculateSubscription.js";

const updateSubRouter = express.Router();

updateSubRouter.put(
  "/subscription/update/:id",
  userAuthorization,
  [
    body(constantsUpdateSub.plan)
      .isInt({ min: 1, max: 3 })
      .withMessage(constantsUpdateSub.planMessage),
    body(constantsUpdateSub.receiptEmail)
      .isEmail()
      .withMessage(constantsUpdateSub.receiptEmailMessage),
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
    const { plan } = req.body;
    const price = calculatePrice(plan);
    console.log(subscription.expiresAt);
    const expiresAtObj = calculateExpiration(
      plan,
      subscription.expiresAt.getTime()
    );
    const paymentExpiresAt = calculatePaymentExpiration();
    subscription.set({
      plan,
      price,
      paymentExpiresAt,
      expiresAt: expiresAtObj,
      status: constants.status.pending,
    });
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
      receiptEmail: req.body.receipt_email,
      userEmail: updatedSubscription.userEmail,
      status: updatedSubscription.status,
      paymentExpiresAt: updatedSubscription.paymentExpiresAt,
    });
    res.status(200).send(updatedSubscription);
  }
);

export { updateSubRouter };
