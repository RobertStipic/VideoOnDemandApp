import express from "express";
import { adminAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { SubscriptionCancelledPublisher } from "../events/publisher/subscription-cancelled-publisher.js";
import { AdminActionPublisher } from "../events/publisher/admin-action-publisher.js";
import { constants } from "../constants/general.js";

const adminCancelRouter = express.Router();

adminCancelRouter.delete(
  "/subscription/admin/remove/:id",
  adminAuthorization,
  async (req, res) => {
    try {
      const { id } = req.params;

      const subscription = await Subscription.findById(id);
      if (!subscription) {
        return res.status(404).send("Subscription not found");
      }

      if (subscription.status === constants.status.cancelled) {
        return res.status(400).send("Subscription already cancelled");
      }

      if (subscription.status !== constants.status.succeeded) {
        return res
          .status(400)
          .send("Only succeeded subscriptions can be cancelled");
      }
      const oldStatus = subscription.status;
      subscription.status = constants.status.cancelled;
      await subscription.save();

      await new SubscriptionCancelledPublisher(
        natsWrapperClient.jsClient,
        Subjects.SubscriptionCancelled,
      ).publish({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        userEmail: subscription.userEmail,
        status: subscription.status,
      });
      await new AdminActionPublisher(
        natsWrapperClient.jsClient,
        Subjects.AdminActionLogged,
      ).publish({
        adminEmail: req.currentUser.email,
        action: "subscription:cancel",
        service: "subscription",
        targetId: subscription.id,
        targetEmail: subscription.userEmail,
        details: { previousStatus: oldStatus },
        timestamp: new Date().toISOString(),
      });

      console.log(
        `[subscription] Admin cancelled subscription ${subscription.id} (user: ${subscription.userEmail})`,
      );

      res.status(200).send({
        cancelled: subscription.id,
        userEmail: subscription.userEmail,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error while cancelling subscription");
    }
  },
);

export { adminCancelRouter };
