import { Listener } from "@robstipic/middlewares";
import { paymentExpirationQueue } from "./expiration-queue.js";

export class SubscriptionCreatedListener extends Listener {
  async onMessage(data, msg) {
    try {
    const delay = new Date(data.paymentExpiresAt).getTime() - Date.now();
    console.log(
      `Scheduling expiration for subscription ${data.subscriptionId} in ${(
        delay /
        1000 /
        60
      ).toFixed(0)} minutes`
    );
    const jobId = `expiration-${data.subscriptionId}`;
    await paymentExpirationQueue.add(
      { subscriptionId: data.subscriptionId },
      { delay, jobId }
    );

    msg.ack();
  }

    catch (error) {
    console.error("Error processing subscription created event", error);
      }
    }
  }
