import { Listener } from "@robstipic/middlewares";
import { User } from "../../models/user.js";

export class SubscriptionExpiredListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
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

    //DATA OBJECT FROM PAYMENT:
    //const payment = {
    // paymentId: data.paymentId,
    //subscriptionId: data.subscriptionId,
    //stripeId: data.stripeId,
    //userEmail: data.userEmail,
    //receiptUrl: data.receiptUrl,
    //receiptEmail: data.receiptEmail,
    //status: data.status,
    //price: data.amount,
    //currency: data.currency,
    //};
    msg.ack();
  }
}
