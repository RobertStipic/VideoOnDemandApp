import { Listener } from "@robstipic/middlewares";
import { paymentExpirationQueue } from "./expiration-queue.js";

export class SubscriptionUpdatedListener extends Listener {
  async onMessage(data, msg) {
    const delay = new Date(data.paymentExpiresAt).getTime() - Date.now();
    console.log(
      `Scheduling expiration for subscription update with id: ${
        data.subscriptionId
      } in ${(delay / 1000 / 60).toFixed(0)} minutes`
    );

    await paymentExpirationQueue.add(
      { subscriptionId: data.subscriptionId },
      { delay }
    );

    msg.ack();
  }
}
