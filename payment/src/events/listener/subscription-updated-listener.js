import { Listener } from "./listener.js";
import { Subscription } from "../../models/subscription.js";
export class SubscriptionUpdatedListener extends Listener {
  async onMessage(data, msg) {
    console.log(
      "Subscription updated event received with expiration date: ",
      data.expiresAt
    );
    const subscription = await Subscription.findOne({
      subscriptionId: data.subscriptionId,
    });
    subscription.set({
      plan: data.plan,
      expiresAt: data.expiresAt,
      price: data.price,
    });
    await subscription.save();

    msg.ack();
  }
}
