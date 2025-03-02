import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionCreatedListener extends Listener {
  async onMessage(data, msg) {
    console.log("Subscription created event received ");
    await Subscription.create({
      subscriptionId: data.subscriptionId,
      userId: data.userId,
      expiresAt: data.expiresAt,
      paymentExpiresAt: data.paymentExpiresAt,
      status: data.status,
      price: data.price,
      plan: data.plan,
    });

    msg.ack();
  }
}
