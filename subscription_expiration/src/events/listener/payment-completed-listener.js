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

    const date = new Date(data.expiresAt);
    console.log(
      "Inserting new subscription for user: ",
      data.userId,
      "ending at: ",
      date.toUTCString()
    );
     await Subscription.create({
      userId: data.userId,
      subscriptionId: data.subscriptionId,
      paymentId: data.paymentId,
      expiresAt: data.expiresAt,
      isSubscribed: true,
    });

    msg.ack();
  }
  catch(error) {
    console.error(`Error processing payment completed event for subscription: ${data.subscriptionId}`, error);
  }
}
}