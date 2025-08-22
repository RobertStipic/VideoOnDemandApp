import express from "express";
import { StripePayment } from "../models/payment.js";
import { body, validationResult } from "express-validator";
import { userAuthorization } from "@robstipic/middlewares";
import { constantsSubId } from "../consants/general.js";
const findPaymentRouter = express.Router();


findPaymentRouter.get(
  "/payment/find",
  userAuthorization,
  [
    body(constantsSubId.subscriptionId)
      .not()
      .isEmpty()
      .withMessage(constantsSubId.subscriptionMessage),
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

    res.status(200).send(payment);
  }
);

export { findPaymentRouter };
