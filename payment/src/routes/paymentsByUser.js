import express from "express";
import { StripePayment } from "../models/payment.js";
import { userAuthorization } from "@robstipic/middlewares";

const findPaymentsByUserRouter = express.Router();

findPaymentsByUserRouter.get(
  "/payment/userpayments",
  userAuthorization,
  async (req, res) => {
    try{
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
  }catch (error) {
     res.status(500).send("Error while retriving payment by user");
    }
  }
);

export { findPaymentsByUserRouter };
