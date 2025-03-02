import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
export class SubscriptionCancelledListener extends Listener {
  async onMessage(data, msg) {
    console.log("Payment time expired for subscription: ", data.subscriptionId);
    const subscription = await Subscription.findOne({
      subscriptionId: data.subscriptionId,
    });
    subscription.set({
      status: data.status,
    });
    await subscription.save();

    msg.ack();
  }
}
