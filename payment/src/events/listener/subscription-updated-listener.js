import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";
import { StripePayment } from "../../models/payment.js";
import { PaymentCompletedPublisher } from "../publisher/payment-completed-publisher.js";
import { stripe } from "../../stripeClient.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "../../nats-wrapper.js";

const token = "tok_visa";

export class SubscriptionUpdatedListener extends Listener {
  async onMessage(data, msg) {
    console.log(
      "Subscription updated event received with id: ",
      data.subscriptionId
    );
    if (data.status === "cancelled") {
      throw new Error("Payment time has expired, cannot proceed with payment");
    }
    const chargeInfo = await stripe.charges.create({
      source: token,
      amount: data.price * 100,
      currency: "eur",
      description: `Payment for user ${data.userEmail} with subscription id ${data.subscriptionId}`,
      receipt_email: data.receipt_email,
    });
    if (chargeInfo.status !== "succeeded") {
      throw new Error("Payment has not succeeded");
    }
    console.log("Payment succeeded, creating user");
    const subscription = await Subscription.create({
      subscriptionId: data.subscriptionId,
      plan: data.plan,
      expiresAt: data.expiresAt,
      price: data.price,
      userId: data.userId,
      status: "succeeded",
      paymentExpiresAt: data.expiresAt,
    });
    await subscription.save();
    console.log("user createded, saving payment:");
    const payment = await StripePayment.create({
      subscriptionId: data.subscriptionId,
      stripeID: chargeInfo.id,
      userEmail: data.userEmail,
      paymentTime: new Date(chargeInfo.created * 1000),
      payment_method: chargeInfo.payment_method,

      payment_info: {
        amount: chargeInfo.amount / 100,
        amount_captured: chargeInfo.amount_captured / 100,
        currency: chargeInfo.currency,
        fee: chargeInfo.application_fee_amount / 100,
        review: chargeInfo.review,
        status: chargeInfo.status,
        paid: chargeInfo.paid,
        description: chargeInfo.description,
      },
      payment_method_details: {
        type: chargeInfo.payment_method_details.type,
        card: chargeInfo.payment_method_details.card.brand,
        card_last4: chargeInfo.payment_method_details.card.last4,
        card_exp_month: chargeInfo.payment_method_details.card.exp_month,
        card_exp_year: chargeInfo.payment_method_details.card.exp_year,
        network: chargeInfo.payment_method_details.card.network,
        funding: chargeInfo.payment_method_details.card.funding,
      },

      receipt_info: {
        receipt_email: chargeInfo.receipt_email,
        receipt_url: chargeInfo.receipt_url,
      },
    });
    console.log("Payment saved publishing event:");
    await new PaymentCompletedPublisher(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted
    ).publish({
      paymentId: payment.id,
      stripeId: payment.stripeID,
      subscriptionId: payment.subscriptionId,
      userEmail: payment.userEmail,
      receiptEmail: payment.receipt_info.receipt_email,
      receiptUrl: payment.receipt_info.receipt_url,
      amount: payment.payment_info.amount,
      currency: payment.payment_info.currency,
      status: payment.payment_info.status,
      description: payment.payment_info.description,
      expiresAt: subscription.expiresAt,
      userId: subscription.userId,
    });

    msg.ack();
  }
}
