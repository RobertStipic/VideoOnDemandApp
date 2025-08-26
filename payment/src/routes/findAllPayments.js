import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { StripePayment } from "../models/payment.js";

const findAllRouter = express.Router();

findAllRouter.get(
  "/payment/findall",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try {
      const payment = await StripePayment.find({}).select({
        "payment_info.amount": 1,
        "payment_info.amount_captured": 1,
        "payment_info.currency": 1,
        "payment_info.paid": 1,
        "payment_info.description": 1,
        "receipt_info.receipt_url": 1,
        userEmail: 1,
        id: 1, 
      });
      console.log("Number of payments", payment.length);

      res.status(200).send(payment);
    } catch (error) {
     res.status(500).send("Error while retriving all payments");
    }
  }
);

export { findAllRouter };
