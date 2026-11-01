import express from "express";
import { adminAuthorization } from "@robstipic/middlewares";
import { StripePayment } from "../models/payment.js";

const findAllRouter = express.Router();

findAllRouter.get("/payment/findall", adminAuthorization, async (req, res) => {
  try {
    const payment = await StripePayment.find({})
      .select({
        stripeID: 1,
        subscriptionId: 1,
        paymentTime: 1,
        userEmail: 1,
        "payment_info.amount": 1,
        "payment_info.amount_captured": 1,
        "payment_info.currency": 1,
        "payment_info.status": 1,
        "payment_info.paid": 1,
        "payment_info.description": 1,
        "payment_method_details.card": 1,
        "payment_method_details.card_last4": 1,
        "payment_method_details.network": 1,
        "receipt_info.receipt_email": 1,
        "receipt_info.receipt_url": 1,
      })
      .sort({ paymentTime: -1 });
    console.log("Number of payments", payment.length);

    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send("Error while retriving all payments");
  }
});

export { findAllRouter };
