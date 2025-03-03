import { SubscriptionCreatedListener } from "./events/listener/subscription-created-listener.js";
import { PaymentCompletedListener } from "./events/listener/payment-completed-listener.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-client.js";
import {
  subscriptionEndedQueue,
  FIVE_MINUTES,
} from "./events/queue/subscription-ended-queue.js";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID_IS_NEEDED");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NAT_CLUSTER_ID_IS_NEEDED");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL_IS_REQUIRED");
  }

  try {
    // Connect to NATS client.
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    new SubscriptionCreatedListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCreated,
      "subscription-created-sub-expiration-service"
    ).listen();

    new PaymentCompletedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted,
      "subscription-created-sub-expiration-service"
    ).listen();

    subscriptionEndedQueue.add(
      {},
      {
        repeat: { cron: FIVE_MINUTES },
      }
    );
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_REDIS/NATS_SERVER", error);
  }
};

start();
