import express from "express";
import { StripePayment } from "../models/payment.js";
import { body, validationResult } from "express-validator";
import { userAuthorization } from "@robstipic/middlewares";
import { constantsStripeID } from "../consants/general.js";
const findPaymentRouter = express.Router();


findPaymentRouter.get(
  "/payment/find",
  userAuthorization,
  [
    body(constantsStripeID.stripeID)
      .not()
      .isEmpty()
      .withMessage(constantsStripeID.paymentMessage),
  ],
  async (req, res) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { stripeID } = req.body;

    const payment = await StripePayment.findOne({
      stripeID,
    });

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    res.status(200).send(payment);
  }catch (error) {
     res.status(500).send("Error while retriving payment");
    }
  }
);

export { findPaymentRouter };
