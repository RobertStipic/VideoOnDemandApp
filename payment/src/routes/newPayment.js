import express from "express";
import { Subscription } from "../models/subscription.js";
import { StripePayment } from "../models/payment.js";
import { body, validationResult } from "express-validator";
import { constants } from "../consants/general.js";
import { userAuthorization, Subjects } from "@robstipic/middlewares";
import { PaymentCompletedPublisher } from "../events/publisher/payment-completed-publisher.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { stripe } from "../stripeClient.js";
import { constantsNewPayment } from "../consants/general.js";
const paymentRouter = express.Router();


paymentRouter.post(
  "/payment/new",
  userAuthorization,
  [
    body(constantsNewPayment.token)
      .not()
      .isEmpty()
      .withMessage(constantsNewPayment.tokenMessage),
    body(constantsNewPayment.subscriptionId)
      .not()
      .isEmpty()
      .withMessage(constantsNewPayment.subscriptionMessage),
    body(constantsNewPayment.receiptEmail)
      .isEmail()
      .withMessage(constantsNewPayment.receiptEmailMessage),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { token, subscriptionId } = req.body;

    const subscription = await Subscription.findOne({
      subscriptionId: subscriptionId,
    });

    if (!subscription) {
      return res.status(404).send("Subscription not found");
    }

    if (subscription.status === constants.status.cancelled) {
      return res.status(400).send("Subscription is cancelled");
}

    if (subscription.status === constants.status.expired) {
      return res.status(400).send("Given subscription has expired");
    }

    if (subscription.status === constants.status.succeeded) {
      return res.status(400).send("Subscription already paid");
    }

    if (subscription.status === constants.status.paymentExpired) {
      return res.status(400).send("Payment period expired");
    }
    const chargeInfo = await stripe.charges.create({
      source: token,
      amount: subscription.price * 100,
      currency: "eur",
      description: `Payment for user ${req.currentUser.email} with subscription id ${subscriptionId}`,
      receipt_email: req.body.receipt_email,
    });
    const payment = await StripePayment.create({
      subscriptionId,
      stripeID: chargeInfo.id,
      userEmail: req.currentUser.email,
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
    subscription.set({
      status:constants.status.succeeded
      });
      await subscription.save();
      
    res.status(201).send({ payment });
  }
);

export { paymentRouter };
