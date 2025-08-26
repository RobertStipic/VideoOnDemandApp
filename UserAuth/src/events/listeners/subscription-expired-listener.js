import { Listener } from "@robstipic/middlewares";
import { User } from "../../models/user.js";

export class SubscriptionExpiredListener extends Listener {
  async onMessage(data, msg) {
    try{
    const user = await User.findById(data.userId);

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
      "Has expired,",
      " User subscription status:",
      user.isSubscribed
    );
    msg.ack();
  }catch (error) {
      console.error("Error processing subscription expired event", error)
    }
  }
}
