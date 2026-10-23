import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { CurrentUserRouter } from "./routes/CurrentUser.js";
import { Subjects } from "@robstipic/middlewares";
import { LogInRouter } from "./routes/LogIn.js";
import { LogOutRouter } from "./routes/LogOut.js";
import { SignUpRouter } from "./routes/SignUp.js";
import { DeleteRouter } from "./routes/DeleteAccount.js";
import { RefreshTokenRouter } from "./routes/RefreshToken.js";
import { natsQueues } from "./consants/queues.js";
import { ChangePasswordRouter } from "./routes/ChangePassword.js";
import { natsWrapperClient } from "./nats-wrapper.js";
import { PaymentCompletedListener } from "./events/listeners/payment-completed-listener.js";
import { SubscriptionExpiredListener } from "./events/listeners/subscription-expired-listener.js";
import { SubscriptionStatusRouter } from "./routes/SubscriptionStatus.js";
import { ForgotPasswordRouter } from "./routes/ForgotPassword.js";
import { ResetPasswordRouter } from "./routes/ResetPassword.js";
import { ActivateAccountRouter } from "./routes/ActivateAccount.js";
import { ResendActivationRouter } from "./routes/ResendActivation.js";
import { SubscriptionCancelledListener } from "./events/listeners/subscription-cancelled-listener.js";

const { json } = bodyparser;
const app = express();
app.set("trust proxy", 1);
app.use(json());
app.use(cookieParser());
app.use(SubscriptionStatusRouter);
app.use(CurrentUserRouter);
app.use(LogInRouter);
app.use(RefreshTokenRouter);
app.use(LogOutRouter);
app.use(SignUpRouter);
app.use(ChangePasswordRouter);
app.use(ForgotPasswordRouter);
app.use(ResetPasswordRouter);
app.use(ActivateAccountRouter);
app.use(ResendActivationRouter);
app.use(DeleteRouter);

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
      natsQueues.paymentCompleted,
    ).listen();
    new SubscriptionExpiredListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionExpired,
      natsQueues.subscriptionExpired,
    ).listen();
    new SubscriptionCancelledListener(
      natsWrapperClient.jsClient,
      Subjects.SubscriptionCancelled,
      natsQueues.subscriptionCancelled,
    ).listen();

    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log("Error connecting to Database or NATS", err);
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
};

startApp();
