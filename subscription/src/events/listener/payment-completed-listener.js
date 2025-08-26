import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    try{
    const subscription = await Subscription.findById({
      _id: data.subscriptionId,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }
    subscription.set({ status: data.status });
    await subscription.save();
    console.log(
      "Payment complited event received: payment status updated with following keyword:",
      subscription.status,
      "for subscriptionId:",
      data.subscriptionId
    );
    msg.ack();
  }catch(error) {
    console.error("Error processing payment completed event", error);
  }
  }
  
}
