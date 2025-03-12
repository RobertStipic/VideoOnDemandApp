import { Subjects, currentUser } from "@robstipic/middlewares";
import { natsQueues } from "./consants/queues.js";
import { natsWrapperClient } from "./nats-client.js";
import { UserAuthListener } from "./events/listeners/user-login-listener.js";
import mongose from "mongoose";
import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import { lastActivityRouter } from "./routes/FindLastActivity.js";
import { userActivityRouter } from "./routes/FindAllActivity.js";
import { registrationDateRouter } from "./routes/RegistrationDate.js";
import cookieSession from "cookie-session";
const { json } = bodyparser;
const app = express();
app.set("trust proxy", true); //ingress-nginx uses proxies
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(json());
app.use(currentUser);
app.use(userActivityRouter);
app.use(lastActivityRouter);
app.use(registrationDateRouter);
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});
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

    new UserAuthListener(
      natsWrapperClient.jsClient,
      Subjects.UserAuth,
      natsQueues.UserAuth
    ).listen();
    await mongose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_DATABASE/NATS_SERVER", error);
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
};

start();
