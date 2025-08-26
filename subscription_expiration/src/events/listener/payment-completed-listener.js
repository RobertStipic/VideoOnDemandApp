import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    try {
    if (data.status !== constants.status.succeeded) {
      console.error(
        "Payment has not succeeded, subscription not updated for",
        data.subscriptionId
      );
      msg.ack();
      return;
    }
    let subscription = await Subscription.findOne({
      userId: data.userId,
    });
     const date = new Date(data.expiresAt);
    if (subscription) {
        console.log(
          "Updating existing subscription for user:",
          data.userId,
          "current expiresAt:",
          subscription.expiresAt.toUTCString()
        );
        const currentExpiresAt = new Date(subscription.expiresAt);
        const updatedExpiresAt = new Date(
          Math.max(currentExpiresAt.getTime(), Date.now()) + (date.getTime() - Date.now())
        );
        subscription.subscriptionId = data.subscriptionId; 
        subscription.paymentId = data.paymentId; 
        subscription.expiresAt = updatedExpiresAt; 
        subscription.isSubscribed = true;
    } else {
    const date = new Date(data.expiresAt);
    console.log(
      "Inserting new subscription for user: ",
      data.userId,
      "ending at: ",
      date.toUTCString()
    );
    subscription = await Subscription.create({
      userId: data.userId,
      subscriptionId: data.subscriptionId,
      paymentId: data.paymentId,
      expiresAt: data.expiresAt,
      isSubscribed: true,
    });

  }
    subscription.save();
    msg.ack();
  }
  catch(error) {
    console.error("Error processing payment completed event", error);
  }
}
}