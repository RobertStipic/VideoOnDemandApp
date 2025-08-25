import { Listener, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { constants } from "../../constants/general.js";
export class PaymentExpirationListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
    const subscription = await Subscription.findById(data.subscriptionId);

    if (!subscription) {
      console.error("Subscription not found");
      msg.ack();
      return;
    }

    if (subscription.status === constants.status.pending) {
      subscription.set({ status: constants.status.paymentExpired });
      await subscription.save();
      console.log(Subjects.PaymentExpirationCompleted);
    }
    msg.ack();
  }
}
