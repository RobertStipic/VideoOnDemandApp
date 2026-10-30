import { Listener, Subjects } from "@robstipic/middlewares";
import { User } from "../../models/user.js";

export class SubscriptionAdminCreatedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const user = await User.findOne({ email: data.userEmail });

      if (!user) {
        console.error(`[userauth] User not found: ${data.userEmail}`);
        msg.ack();
        return;
      }

      user.isSubscribed = true;
      await user.save();

      console.log(
        `[userauth] User ${user.email} subscribed (admin-created: ${data.subscriptionId})`,
      );
      msg.ack();
    } catch (error) {
      console.error(
        "[userauth] Error processing admin-created subscription:",
        error,
      );
    }
  }
}
