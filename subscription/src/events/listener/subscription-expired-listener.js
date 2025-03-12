import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class SubscriptionExpiredListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
    const subscription = await Subscription.findById(data.subscriptionId);

    if (!subscription) {
      throw new Error("User not found");
    }
    if (subscription.status !== constants.status.succeeded) {
      throw new Error("Subscription not active");
    }

    subscription.set({ status: constants.status.expired });
    await subscription.save();
    console.log("Subscription ID:", data.subscriptionId, "has expired");
    msg.ack();
  }
}
