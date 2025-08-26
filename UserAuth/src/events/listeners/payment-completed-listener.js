import { Listener } from "@robstipic/middlewares";
import { User } from "../../models/user.js";
import { constants } from "../../consants/general.js";
export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    try{
    if (data.status !== constants.status.succeeded) {
      throw new Error(
        "Payment not succeeded, subscription not updated for user: " +
          data.userEmail +
          "with payment status: " +
          data.status
      );
    }
    const user = await User.findOne({
      email: data.userEmail,
    });

    if (!user) {
      throw new Error("Subscription not found");
    }

    user.set({ isSubscribed: true });
    await user.save();
    console.log(
      "Payment complited event received: subscription updated for user:",
      data.userEmail,
      "with subscriptionId:",
      data.subscriptionId,
      "user subscribed status:",
      user.isSubscribed
    );

    msg.ack();
    }catch (error) {
      console.error("Error processing payment completed event", error)
    }
  }
}
