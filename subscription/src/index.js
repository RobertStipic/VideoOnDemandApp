import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import { natsWrapperClient } from "./nats-wrapper.js";
import mongose from "mongoose";
import { currentUser, Subjects } from "@robstipic/middlewares";
import { natsQueues } from "./constants/queues.js";
import { constants } from "./constants/general.js";
import { cancelSubRouter } from "./routes/cancelSub.js";
import { activeSubsRouter } from "./routes/findAllActiveSubs.js";
import { newSubRouter } from "./routes/newSubs.js";
import { idRouter } from "./routes/findByIdSubs.js";
import { findRouter } from "./routes/findAllSubs.js";
import { updateSubRouter } from "./routes/updateSubscription.js";
import { PaymentCompletedListener } from "./events/listener/payment-completed-listener.js";
import { PaymentExpirationListener } from "./events/listener/payment-expiration-listener.js";
import { SubscriptionExpiredListener } from "./events/listener/subscription-expired-listener.js";
import { AccountDeletedListener } from "./events/listener/account-deleted-listener.js";
const { json } = bodyparser;
const app = express();

app.set("trust proxy", true); //ingress-nginx uses proxies
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    maxAge: constants.cookieAge, //12 H
  })
);

app.use(currentUser);
app.use(newSubRouter);
app.use(activeSubsRouter);
app.use(idRouter);
app.use(findRouter);
app.use(cancelSubRouter);
app.use(updateSubRouter);

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
  try {
    await natsWrapperClient.connect(process.env.NATS_URL);

    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());
    new PaymentCompletedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted,
      natsQueues.paymentCompleted
    ).listen();
    new PaymentExpirationListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentExpirationCompleted,
      natsQueues.PaymentExpirationCompleted
    ).listen();
    new SubscriptionExpiredListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionExpired,
      natsQueues.subscriptionExpired
    ).listen();
    new AccountDeletedListener(
      natsWrapperClient.jsClient,
      Subjects.AccountDeleted,
      natsQueues.AccountDeleted
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
