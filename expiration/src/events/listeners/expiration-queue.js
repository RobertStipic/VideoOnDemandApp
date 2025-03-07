import Queue from "bull";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "../../nats-client.js";
import { PaymentExpirationPublisher } from "../publishers/payment-expiration-complete-publisher.js";
import { bullQueues } from "../../consants/queues.js";

const paymentExpirationQueue = new Queue(
  bullQueues.subscriptionExpirationQueue,
  {
    redis: {
      host: process.env.REDIS_HOST,
    },
  }
);

paymentExpirationQueue.process(async (job) => {
  await new PaymentExpirationPublisher(
    natsWrapperClient.client,
    Subjects.PaymentExpirationCompleted
  ).publish({
    subscriptionId: job.data.subscriptionId,
  });
});

export { paymentExpirationQueue };
