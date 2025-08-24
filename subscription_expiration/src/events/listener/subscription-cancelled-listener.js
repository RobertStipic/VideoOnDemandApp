import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class SubscriptionCancelledListener extends Listener {
  async onMessage(data, msg) {
try {
      const subscription = await Subscription.findOne({subscriptionId: data.subscriptionId});
      if (!subscription) {
        console.error("Subscription not found for cancellation:", data.subscriptionId);
        msg.ack();
        return;
      }

      await subscription.deleteOne();
      console.log("Subscription deleted after cancellation:", data.subscriptionId);

      msg.ack();
    } catch (error) {
      console.error("Error in SubscriptionCancelledListener:", error);
      msg.ack();
    }
  }
}
