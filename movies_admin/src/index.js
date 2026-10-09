import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import { currentUser } from "@robstipic/middlewares";
import { natsWrapperClient } from "./nats-wrapper.js";
import { uploadMovieRouter } from "./routes/MovieUpload.js";

const { json } = bodyparser;
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    maxAge: 12 * 60 * 60 * 1000,
  }),
);
app.use(currentUser);
app.use(uploadMovieRouter);

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

const startApp = async () => {
  if (!process.env.JWT_PRIVATE_KEY)
    throw new Error("JWT_PRIVATE_KEY must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("Connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());
  } catch (err) {
    console.log("Error connecting to NATS", err);
  }

  app.listen(3000, () => {
    console.log("Server up and running on port 3000");
  });
};

startApp();
