import express from "express";
import { Subscription } from "../models/subscription.js";
import { body, validationResult } from "express-validator";
import { userAuthorization } from "@robstipic/middlewares";
import { constantsSubId } from "../consants/general.js";
const findSubscriptionStatus = express.Router();

findSubscriptionStatus.get(
  "/payment/subscriptionstatus",
  userAuthorization,
  [
    body(constantsSubId.subscriptionId)
      .not()
      .isEmpty()
      .withMessage(constantsSubId.subscriptionMessage),
  ],
  async (req, res) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { subscriptionId } = req.body;

    const subscription = await Subscription.findOne({
      subscriptionId,
    });

    if (!subscription) {
      return res.status(404).send("Subscription not found");
    }

    res.status(200).send({
  status: subscription.status,
  subscriptionId: subscription.subscriptionId
});
}catch (error) {
     res.status(500).send("Error while retriving subscription status");
    }
  }
);

export { findSubscriptionStatus };
