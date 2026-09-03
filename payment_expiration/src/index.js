import { SubscriptionCreatedListener } from "./events/listeners/subscription-created-listener.js";
import { PaymentCompletedListener } from "./events/listeners/payment-completed-listener.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-client.js";
import { natsQueues } from "./consants/queues.js";

const start = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL_IS_REQUIRED");
  }

  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    new SubscriptionCreatedListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCreated,
      natsQueues.SubscriptionCreated
    ).listen();
    new PaymentCompletedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted,
      natsQueues.paymentCompleted,
    ).listen();
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_REDIS/NATS_SERVER", error);
  }
};

start();
