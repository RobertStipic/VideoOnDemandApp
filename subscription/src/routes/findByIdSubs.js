import express from "express";
import { Subscription } from "../models/subscription.js";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { constantsFindId } from "../consants/general.js";
const idRouter = express.Router();

idRouter.post(
  "/subscription/idsearch",
  currentUser,
  userAuthorization,
  [
    body(constantsFindId.subscriptionId)
      .isMongoId()
      .withMessage(constantsFindId.subscriptionIdMessage),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    try {
      const { subscriptionId } = req.body;
      console.log("subscriptionId:", subscriptionId);

      const subscription = await Subscription.findById(subscriptionId);

      if (!subscription.userId.equals(req.currentUser.id)) {
        return res.status(401).send("Not authorized");
      }

      res.status(200).send(subscription);
    } catch (error) {
      console.log("error:", error);
      return res.status(404).send("Not Found");
    }
  }
);

export { idRouter };
