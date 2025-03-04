import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionCreatedListener extends Listener {
  queueGroupName = "subscription-created-expiration-service";

  async onMessage(data, msg) {
    const subscription = await Subscription.findOne();
    console.log(subscription);
    msg.ack();
  }
}
