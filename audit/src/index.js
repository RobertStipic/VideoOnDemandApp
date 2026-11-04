import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { currentUser, Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-client.js";
import { AdminActionListener } from "./events/listeners/admin-action-listener.js";
import { natsQueues } from "./constants/queues.js";

const { json } = bodyparser;
const app = express();

app.set("trust proxy", 1);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    maxAge: 12 * 60 * 60 * 1000,
  }),
);
app.use(currentUser);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

const startApp = async () => {
  if (!process.env.JWT_PRIVATE_KEY)
    throw new Error("JWT_PRIVATE_KEY must be defined");
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("[audit service] Connected to NATS");

    new AdminActionListener(
      natsWrapperClient.jsClient,
      Subjects.AdminActionLogged,
      natsQueues.adminActionLogged,
    ).listen();

    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    await mongoose.connect(process.env.DATABASE_URL);
    console.log("[audit service] Connected to Database");
  } catch (err) {
    console.error("[audit service] Fatal:", err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("[audit service] Server up and running on port 3000");
  });
};

startApp();
