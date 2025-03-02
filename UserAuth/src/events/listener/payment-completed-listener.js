import { Listener } from "@robstipic/middlewares";
import { User } from "../../models/user.js";

export class PaymentCompletedListener extends Listener {
  async onMessage(data, msg) {
    console.log("Payment complited event received: ", data.description);
    // console.log("data: ", data);
    if (data.status !== "succeeded") {
      throw new Error(
        "Payment not succeeded, subscription not updated for user: " +
          data.userEmail
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
      "Subscription updated for user:",
      data.userEmail,
      "with subscriptionId:",
      data.subscriptionId,
      "user subscribed status:",
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
