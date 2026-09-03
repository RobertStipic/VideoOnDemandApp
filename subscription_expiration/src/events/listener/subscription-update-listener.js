import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class SubscriptionUpdatedListener extends Listener {
    async onMessage(data, msg){
    try {
           const subscription = await Subscription.findOne({ subscriptionId: data.subscriptionId });

            if (!subscription) {
            console.error("Updated subscription not found for cancellation:", data.subscriptionId);
             msg.ack();
            return;
            }            

            await subscription.deleteOne();
            console.log("Subscription deleted after extension:", data.subscriptionId);

            msg.ack()

        } catch (error) {
            console.error(`Error removing extended subscription with id:${data.subscriptionId}`, error);
    }
  }
}