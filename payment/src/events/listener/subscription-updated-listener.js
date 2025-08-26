import { Listener, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";

export class SubscriptionUpdatedListener extends Listener {
  async onMessage(data, msg) {
    try{
    console.log(
      "Subscription updated event received with id: ",
      data.subscriptionId
    );
    if (data.status !== constants.status.pending) {
      throw new Error("Subscription status must be pending");
    }
    const subscription = await Subscription.findOne({
      subscriptionId: data.subscriptionId,
    });
    subscription.set({plan: data.plan});
    await subscription.save();
    msg.ack();
  }catch(error) {
    console.error("Error processing subscription updated event", error);
  }
}
}
