import { Listener, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { SubscriptionCancelledPublisher } from "../publisher/subscription-cancelled-publisher.js";
import { natsWrapperClient } from "../../nats-wrapper.js";
const ORDER_CANCELLED = "cancelled";
export class PaymentExpirationListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
    const subscription = await Subscription.findById(data.subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "pending") {
      subscription.set({ status: ORDER_CANCELLED });
      await subscription.save();
      console.log(Subjects.SubscriptionCancelled);
      new SubscriptionCancelledPublisher(
        natsWrapperClient.client,
        Subjects.SubscriptionCancelled
      ).publish({
        subscriptionId: data.subscriptionId,
        status: ORDER_CANCELLED,
      });
    }
    msg.ack();
  }
}
