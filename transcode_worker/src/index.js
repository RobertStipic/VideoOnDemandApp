import mongoose from "mongoose";
import express from "express";
import "./queues/videoQueue.js";
import { MetricsRouter } from "./routes/Metrics.js";

const app = express();

app.use(MetricsRouter);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

const startApp = async () => {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be defined");
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL must be defined");

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
