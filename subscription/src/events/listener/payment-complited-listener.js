import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class PaymentComplitedListener extends Listener {
  async onMessage(data, msg) {
    // console.log("data: ", data);
    const subscription = await Subscription.findById({
      _id: data.subscriptionId,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }
    subscription.set({ status: data.status });
    await subscription.save();
    console.log(
      "Payment complited event received: payment status updated with following keyword:",
      subscription.status,
      "for subscriptionId:",
      data.subscriptionId
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
