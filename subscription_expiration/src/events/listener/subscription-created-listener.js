import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionCreatedListener extends Listener {
  queueGroupName = "subscription-created-expiration-service";

  async onMessage(data, msg) {
    const subTime = new Date(data.ExpiresAt).getTime() - Date.now();
    if (subTime > 0) {
      await Subscription.create({
        userId: data.userId,
        subscriptionId: data.subscriptionId,
        expiresAt: data.ExpiresAt,
      });
    }

    msg.ack();
  }
}
