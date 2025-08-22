import { Listener, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../consants/general.js";
export class PaymentExpirationListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
    const subscription = await Subscription.findOne({
      subscriptionId: data.subscriptionId,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === constants.status.pending) {
      subscription.set({ status: constants.status.paymentExpired });
      await subscription.save();
      console.log(Subjects.PaymentExpirationCompleted);
    }
    msg.ack();
  }
}
