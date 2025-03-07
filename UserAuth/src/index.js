import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import mongose from "mongoose";
import cookieSession from "cookie-session";
import { CurrentUserRouter } from "./routes/CurrentUser.js";
import { Subjects } from "@robstipic/middlewares";
import { LogInRouter } from "./routes/LogIn.js";
import { LogOutRouter } from "./routes/LogOut.js";
import { SingUpRouter } from "./routes/SignUp.js";
import { natsQueues } from "./consants/queues.js";
import { ChangePasswordRouter } from "./routes/ChangePassword.js";
import { natsWrapperClient } from "./nats-wrapper.js";
import { PaymentCompletedListener } from "./events/listeners/payment-completed-listener.js";
import { SubscriptionExpiredListener } from "./events/listeners/subscription-expired-listener.js";

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
app.use(CurrentUserRouter);
app.use(LogInRouter);
app.use(LogOutRouter);
app.use(SingUpRouter);
app.use(ChangePasswordRouter);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});
const startApp = async () => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY must be defined");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
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
    new SubscriptionExpiredListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionExpired,
      natsQueues.subscriptionExpired
    ).listen();
    await mongose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log("Error connecting to Database or NATS");
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
};

startApp();
