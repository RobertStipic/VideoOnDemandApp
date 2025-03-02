import express from "express";
import { Subscription } from "../models/subscription.js";
import { StripePayment } from "../models/payment.js";
import { body, validationResult } from "express-validator";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { PaymentComplitedPublisher } from "../events/publisher/payment-complited-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { stripe } from "../stripeClient.js";

const findPaymentRouter = express.Router();

const SubStatus = "cancelled";
findPaymentRouter.get(
  "/payment/find",
  userAuthorization,
  [
    body("subscriptionId")
      .not()
      .isEmpty()
      .withMessage("Subscription ID is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { subscriptionId } = req.body;

    const payment = await StripePayment.findOne({
      subscriptionId,
    });

    if (!payment) {
      return res.status(404).send("Subscription not found");
    }
    console.log("subscription: ", payment);
    res.status(200).send(payment);
  }
);

export { findPaymentRouter };
