import express from "express";
import { StripePayment } from "../models/payment.js";
import { body, validationResult } from "express-validator";
import { userAuthorization } from "@robstipic/middlewares";

const findBySubIdPaymentRouter = express.Router();

findBySubIdPaymentRouter.get(
  "/payment/findBySubId",
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

    const payment = await StripePayment.find({
      subscriptionId,
    });

    if (!payment) {
      return res.status(404).send("Subscription not found");
    }

    res.status(200).send(payment);
  }
);

export { findBySubIdPaymentRouter };
