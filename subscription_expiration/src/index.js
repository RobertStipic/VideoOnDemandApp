import { PaymentCompletedListener } from "./events/listener/payment-completed-listener.js";
import { natsQueues } from "./consants/queues.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-client.js";
import { Subscription } from "./models/subscription.js";
import mongose from "mongoose";
import { subscriptionEndedQueue } from "./events/queue/subscription-ended-queue.js";
import { constants } from "./consants/general.js";

const start = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL_IS_REQUIRED");
  }

  try {
    // Connect to NATS client.
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    new PaymentCompletedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted,
      natsQueues.paymentCompleted
    ).listen();
    await mongose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");
    const count = await Subscription.countDocuments();
    console.log("active subsciptions: ", count);
    subscriptionEndedQueue.add(
      {},
      {
        repeat: { cron: constants.cronTime.FIVE_SECONDS },
      }
    );
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_DATABASE/NATS_SERVER", error);
  }
};

start();
