import express from "express";
import { Subscription } from "../models/subscription.js";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
const paymentRouter = express.Router();
const SubStatus = "cancelled";
paymentRouter.post(
  "/payment/new",
  currentUser,
  userAuthorization,
  [
    body("token").not().isEmpty().withMessage("Token is required"),
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

    const { token, subscriptionId } = req.body;
    const { userId } = req.currentUser.id;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).send("Subscription not found");
    }

    if (!subscription.userId.equals(userId)) {
      return res.status(401).send("Not authorized");
    }
    if (subscription.status === SubStatus) {
      return res.status(400).send("Bad request");
    }
    res.send({ success: true });
  }
);

export { paymentRouter };
