import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionAdminCreatedListener extends Listener {
  async onMessage(data, msg) {
    try {
      await Subscription.create({
        subscriptionId: data.subscriptionId,
        expiresAt: new Date(data.expiresAt),
        isSubscribed: true,
        userId: data.userId,
        paymentId: data.paymentId || null,
      });
      msg.ack();
    } catch (error) {
      console.error(
        "[expiration] Error processing admin-created subscription:",
        error,
      );
    }
  }
}
