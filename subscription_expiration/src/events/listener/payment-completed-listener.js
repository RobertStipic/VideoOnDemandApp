import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    const subTime = new Date(data.ExpiresAt).getTime() - Date.now();
    if (subTime > 0) {
      if (data.status !== "succeeded") {
        throw new Error(
          "Payment has not succeeded, subscription not updated for",
          data.subscriptionId
        );
      }
      const subscription = await Subscription.findOne({
        subscriptionId: data.subscriptionId,
      });
      if (!subscription) {
        throw new Error("Subscription not found");
      }

      subscription.set({ isSubscribed: true, expiresAt: data.ExpiresAt });
      await subscription.save();
    }

    msg.ack();
  }
}
