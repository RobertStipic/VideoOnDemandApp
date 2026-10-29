import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionAdminExtendedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const subscription = await Subscription.findOne({
        subscriptionId: data.subscriptionId,
      });

      if (!subscription) {
        console.error(
          `[expiration] Subscription not found for admin extend: ${data.subscriptionId}`,
        );
        msg.ack();
        return;
      }

      subscription.expiresAt = new Date(data.expiresAt);
      await subscription.save();

      console.log(
        `[expiration] Admin extended ${data.subscriptionId} to ${data.expiresAt}`,
      );
      msg.ack();
    } catch (error) {
      console.error(
        "[expiration] Error processing admin-extended subscription:",
        error,
      );
    }
  }
}
