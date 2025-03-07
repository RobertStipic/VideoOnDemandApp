import express from "express";
import { StripePayment } from "../models/payment.js";
import { userAuthorization } from "@robstipic/middlewares";

const findPaymentsByUserRouter = express.Router();

findPaymentsByUserRouter.get(
  "/payment/userpayments",
  userAuthorization,
  async (req, res) => {
    const userEmail = req.currentUser.email;

    const payments = await StripePayment.find({ userEmail }).select({
      stripeID: true,
      subscriptionId: true,
      paymentTime: true,
      "receipt_info.receipt_email": true,
      "receipt_info.receipt_url": true,
    });

    if (!payments) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(payments);
  }
);

export { findPaymentsByUserRouter };
