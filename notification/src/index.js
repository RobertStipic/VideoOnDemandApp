import { natsWrapperClient } from "./nats-wrapper.js";
import { Subjects } from "@robstipic/middlewares";
import { natsQueues } from "./constants/queues.js";
import { PaymentCompletedListener } from "./events/listeners/payment-completed-listener.js";
import { PasswordResetListener } from "./events/listeners/password-reset-listener.js";
import { UserActivationListener } from "./events/listeners/user-activation-listener.js";

const startApp = async () => {
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.SMTP_HOST) throw new Error("SMTP_HOST must be defined");
  if (!process.env.SMTP_PORT) throw new Error("SMTP_PORT must be defined");
  if (!process.env.SMTP_USER) throw new Error("SMTP_USER must be defined");
  if (!process.env.SMTP_PASS) throw new Error("SMTP_PASS must be defined");

  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("Connected to NATS");

    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    new UserActivationListener(
      natsWrapperClient.jsClient,
      Subjects.UserAccountActivated,
      natsQueues.userActivation,
    ).listen();
    new PaymentCompletedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentCompleted,
      natsQueues.paymentCompleted,
    ).listen();
    new PasswordResetListener(
      natsWrapperClient.jsClient,
      Subjects.UserPasswordReset,
      natsQueues.passwordReset,
    ).listen();
  } catch (err) {
    console.log("[ERROR_CONNECTING_TO_NATS_SERVER", err);
    process.exit(1);
  }
};

startApp();
