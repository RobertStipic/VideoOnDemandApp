import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import { natsWrapperClient } from "./nats-wrapper.js";
import mongose from "mongoose";
import { currentUser } from "@robstipic/middlewares";
import { removeRouter } from "./routes/removeSubs.js";
import { newSubRouter } from "./routes/newSubs.js";
import { idRouter } from "./routes/findByIdSubs.js";
import { findRouter } from "./routes/findAllSubs.js";
import { updateSubRouter } from "./routes/updateSubscription.js";
import { PaymentComplitedListener } from "./events/listener/payment-complited-listener.js";
import { Subjects } from "./subjects/subjects.js";
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
app.use(newSubRouter);
app.use(idRouter);
app.use(findRouter);
app.use(removeRouter);
app.use(updateSubRouter);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});
const startApp = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID_IS_NEEDED");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NAT_CLUSTER_ID_IS_NEEDED");
  }
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
    new PaymentComplitedListener(
      natsWrapperClient.jsClient,
      Subjects.PaymentComplited,
      "payment-completed-subscription-service"
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
