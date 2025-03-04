import Queue from "bull";
import { Subscription } from "../../models/subscription.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "../../nats-client.js";
import { SubscriptionExpiredPublisher } from "../publisher/subscription-expired-publisher.js";

const FIVE_MINUTES = "*/5 * * * *";
const queueName = "subscription-expiration-queue";

const subscriptionEndedQueue = new Queue(queueName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

subscriptionEndedQueue.process(async (job) => {
  let now = Date.now();

  const subscriptions = await Subscription.find({ expiresAt: { $lt: now } });

  subscriptions.forEach(async (subscription) => {
    await Subscription.updateOne(
      { _id: subscription._id },
      { $set: { isSubscribed: false } }
    );

    await new SubscriptionExpiredPublisher(
      natsWrapperClient.client,
      Subjects.SubscriptionExpired
    ).publish({
      userId: subscription.userId,
      subscriptionId: subscription.subscriptionId,
    });
    await Subscription.deleteOne({ _id: subscription._id });
  });
});

export { subscriptionEndedQueue, FIVE_MINUTES };
