import { Listener } from "@robstipic/middlewares";
import { paymentExpirationQueue } from "../queue/expiration-queue.js";

export class PaymentCompletedListener extends Listener {
    async onMessage(data, msg){
        try {
            const jobId = `expiration-${data.subscriptionId}`;
            const existingJob = await paymentExpirationQueue.getJob(jobId);
            if (existingJob){
                await existingJob.remove();
            }
            msg.ack();
        } catch(error) {
            console.error("Error procesing payment completed event", error);
            msg.ack();
        }

    }
}