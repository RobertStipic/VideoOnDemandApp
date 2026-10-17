import { Listener, Subjects } from "@robstipic/middlewares";
import { sendEmail } from "../../services/emailService.js";
import { paymentReceiptTemplate } from "../../services/templates/paymentReceipt.js";

export class PaymentCompletedListener extends Listener {
  subject = Subjects.PaymentCompleted;
  queueGroupName = "notification-service";

  async onMessage(data, msg) {
    try {
      const html = paymentReceiptTemplate({
        payment: {
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          description: data.description,
          receiptUrl: data.receiptUrl,
        },
        subscription: {
          subscriptionId: data.subscriptionId,
          expiresAt: data.expiresAt,
        },
      });

      await sendEmail({
        to: data.receiptEmail,
        subject: `Payment Receipt - Subscription ${data.subscriptionId}`,
        html,
      });

      msg.ack();
    } catch (error) {
      console.error("Failed to send receipt:", error);
    }
  }
}
