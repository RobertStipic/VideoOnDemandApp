import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    if (data.status !== constants.status.succeeded) {
      throw new Error(
        "Payment has not succeeded, subscription not updated for",
        data.subscriptionId
      );
    }
    const subscriptionExists = await Subscription.findOne({
      subscriptionId: data.subscriptionId,
    });
    if (subscriptionExists) {
      console.log(
        "Deleteing old subscription for: ",
        data.userId,
        "ending at: ",
        subscriptionExists.expiresAt
      );
      await Subscription.deleteOne({ subscriptionId: data.subscriptionId });
    }
    console.log(
      "Inserting new subscription for user: ",
      data.userId,
      "ending at: ",
      data.expiresAt
    );
    const sub = await Subscription.create({
      userId: data.userId,
      subscriptionId: data.subscriptionId,
      paymentId: data.paymentId,
      expiresAt: data.expiresAt,
      isSubscribed: true,
    });
    sub.save();
    msg.ack();
  }
}
