import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class SubscriptionCancelledListener extends Listener {
  async onMessage(data, msg) {
    try {
      const subscription = await Subscription.findOne({
        subscriptionId: data.subscriptionId,
      });
      if (!subscription) {
        console.error("Subscription not found", data.subscriptionId);
        msg.ack();
        return;
      }

      subscription.set({
        status: data.status || constants.status.cancelled,
      });
      await subscription.save();
      console.log(
        "Changing subscription status to cancelled: ",
        data.subscriptionId,
      );
      msg.ack();
    } catch (error) {
      console.error("Error processing subscription cancelled event", error);
    }
  }
}
