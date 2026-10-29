import express from "express";
import { body, validationResult } from "express-validator";
import { adminAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { SubscriptionAdminExtendedPublisher } from "../events/publisher/subscription-admin-extended-publisher.js";
import { constants } from "../constants/general.js";

const adminExtendRouter = express.Router();

adminExtendRouter.patch(
  "/subscription/admin/extend/:id",
  adminAuthorization,
  [
    body("days")
      .isInt({ min: 1, max: 365 })
      .withMessage("Days must be an integer between 1 and 365"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      const { id } = req.params;
      const { days } = req.body;

      const subscription = await Subscription.findById(id);
      if (!subscription) {
        return res.status(404).send("Subscription not found");
      }

      if (subscription.status !== constants.status.succeeded) {
        return res
          .status(400)
          .send("Only succeeded subscriptions can be extended");
      }

      const daysInMs = days * constants.time.DAY;
      const newExpiresAt = new Date(
        subscription.expiresAt.getTime() + daysInMs,
      );

      subscription.expiresAt = newExpiresAt;
      await subscription.save();

      await new SubscriptionAdminExtendedPublisher(
        natsWrapperClient.jsClient,
        Subjects.SubscriptionAdminExtended,
      ).publish({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        userEmail: subscription.userEmail,
        expiresAt: newExpiresAt,
        daysAdded: days,
      });

      console.log(
        `[subscription] Admin extended ${subscription.id} by ${days} days (new expiry: ${newExpiresAt.toISOString()})`,
      );

      res.status(200).send({
        extended: subscription.id,
        newExpiresAt,
        daysAdded: days,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error extending subscription");
    }
  },
);

export { adminExtendRouter };
