import { Listener } from "@robstipic/middlewares";
import { paymentExpirationQueue } from "./expiration-queue.js";

export class SubscriptionCreatedListener extends Listener {
  async onMessage(data, msg) {
    const delay = new Date(data.paymentExpiresAt).getTime() - Date.now();
    console.log(
      `Scheduling expiration for subscription ${data.subscriptionId} in ${(
        delay /
        1000 /
        60
      ).toFixed(0)} minutes`
    );

    await paymentExpirationQueue.add(
      { subscriptionId: data.subscriptionId },
      { delay: 45000 }
    );

    msg.ack();
  }
}
