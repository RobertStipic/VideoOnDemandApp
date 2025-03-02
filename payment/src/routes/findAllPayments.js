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
      const payment = await StripePayment.find({});
      console.log("Number of payments", payment.length);

      res.status(200).send(payment);
    } catch (error) {
      console.log("error:", error);

      return res.status(404).send("Not Found");
    }
  }
);

export { findAllRouter };
