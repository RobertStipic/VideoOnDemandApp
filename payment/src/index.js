import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import { paymentRouter } from "./routes/newPayment.js";
import { findPaymentRouter } from "./routes/findPayment.js";
import { findAllRouter } from "./routes/findAllPayments.js";
import { findBySubIdPaymentRouter } from "./routes/paymentsBySubId.js";
import mongose from "mongoose";
import { SubscriptionCreatedListener } from "./events/listener/subscription-created-listener.js";
import { SubscriptionUpdatedListener } from "./events/listener/subscription-updated-listener.js";
import { SubscriptionCancelledListener } from "./events/listener/subscription-cancelled-listener.js";
import { findPaymentsByUserRouter } from "./routes/paymentsByUser.js";
import { natsWrapperClient } from "./nats-wrapper.js";
import { currentUser, Subjects } from "@robstipic/middlewares";
import { natsQueues } from "./consants/queues.js";

const { json } = bodyparser;
const app = express();

app.set("trust proxy", true); //ingress-nginx uses proxies
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);
app.use(findBySubIdPaymentRouter);
app.use(paymentRouter);
app.use(findPaymentRouter);
app.use(findAllRouter);
app.use(findPaymentsByUserRouter);
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

const startApp = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL_IS_REQUIRED");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error("STRIPE_SECRET_KEY must be defined");
  }

  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    new SubscriptionCreatedListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCreated,
      natsQueues.subscriptionCreated
    ).listen();

    new SubscriptionUpdatedListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionUpdated,
      natsQueues.SubscriptionUpdated
    ).listen();
    new SubscriptionCancelledListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCancelled,
      natsQueues.SubscriptionCancelled
    ).listen();

    await mongose.connect(process.env.DATABASE_URL);

    console.log("Connected to Database");
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_MONGO/NATS_SERVER", error);
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
};

startApp();
