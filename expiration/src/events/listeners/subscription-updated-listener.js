import { Listener } from "@robstipic/middlewares";
import { paymentExpirationQueue } from "./expiration-queue.js";

export class SubscriptionUpdatedListener extends Listener {
  async onMessage(data, msg) {
    const delay = new Date(data.paymentExpiresAt).getTime() - Date.now();

    const jobId = `expiration-${data.subscriptionId}`;
    const existingJob = await paymentExpirationQueue.getJob(jobId);

    if (existingJob) {
      try {
        await existingJob.remove();
      } catch (error) {
        console.log(`Failed to remove existing job: ${error.message}`);
      }
    }

      await paymentExpirationQueue.add(
        { subscriptionId: data.subscriptionId },
        { delay, jobId }
      );
    console.log(
      `Scheduling expiration for subscription ${data.subscriptionId} in ${(
        delay /
        1000 /
        60
      ).toFixed(0)} minutes`
    );
    msg.ack();
  }
}