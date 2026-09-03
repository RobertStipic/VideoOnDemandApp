import { Listener } from "@robstipic/middlewares";
import { User } from "../../models/user.js";

export class SubscriptionCancelledListener extends Listener {
  async onMessage(data, msg) {
    try{
    const user = await User.findOne({
      email: data.userEmail,
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.set({ isSubscribed: false });
    await user.save();
    console.log(
      "Subscription for user:",
      user.email,
      "with subscriptionId:",
      data.subscriptionId,
      "cancelled,",
      " User subscription status:",
      user.isSubscribed
    );

    msg.ack();
    }catch (error) {
      console.error("Error processing subscription cancelled event", error)
    }
  }
}
