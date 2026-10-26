import mongoose from "mongoose";
import express from "express";
import "./queues/videoQueue.js";
import { MetricsRouter } from "./routes/Metrics.js";
import { Subjects } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-client.js";
import { MovieDeletedListener } from "./events/listeners/movie-deleted-listener.js";
import { natsQueues } from "./constants/queues.js";

const app = express();

app.use(MetricsRouter);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

const startApp = async () => {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be defined");
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  await natsWrapperClient.connect(process.env.NATS_URL);
  console.log("[worker] Connected to NATS");

  process.on("SIGINT", () => natsWrapperClient.close());
  process.on("SIGTERM", () => natsWrapperClient.close());

  new MovieDeletedListener(
    natsWrapperClient.jsClient,
    Subjects.MovieDeleted,
    natsQueues.MovieDeleted,
  ).listen();

  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to Mongo");

  console.log("Waiting for jobs on queue: video-transcode");
  app.listen(9100, () => {
    console.log("Metrics server up and running on port 9100");
  });
};

startApp().catch((err) => {
  console.error("transcode worker error:", err);
  process.exit(1);
});
