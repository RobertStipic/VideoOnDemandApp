import mongoose from "mongoose";
import "./queues/videoQueue.js";

const startApp = async () => {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be defined");
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL must be defined");

  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to Mongo");

  console.log("Waiting for jobs on queue: video-transcode");
};

startApp().catch((err) => {
  console.error("transcode worker error:", err);
  process.exit(1);
});
