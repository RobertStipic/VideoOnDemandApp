import { Subjects, currentUser } from "@robstipic/middlewares";
import { natsQueues } from "./consants/queues.js";
import { natsWrapperClient } from "./nats-client.js";
import { MoviePlayedListener } from "./events/listeners/movie-played-listener.js";
import mongose from "mongoose";
import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import { UserWatchHistoryRouter } from "./routes/UserWatchHistory.js";
import { initizializeCSV } from "./services/loadCSVtoDB.js";
import { constants } from "./consants/general.js";
import cookieSession from "cookie-session";
import { CompleteHistoryRouter } from "./routes/CompleteWatchHistory.js";
import { FullMovieHistory } from "./routes/FullMovieHistory.js";
const { json } = bodyparser;
const app = express();
app.set("trust proxy", true); //ingress-nginx uses proxies
app.use(
  cookieSession({
    signed: false,
    secure: true,
    maxAge: constants.cookieAge, // 12 H
  })
);
app.use(json());
app.use(currentUser);
app.use(UserWatchHistoryRouter);
app.use(CompleteHistoryRouter);
app.use(FullMovieHistory);

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

    new MoviePlayedListener(
      natsWrapperClient.jsClient,
      Subjects.MoviePlayed,
      natsQueues.MoviePlayed
    ).listen();
    await mongose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");
    await initizializeCSV();
  } catch (error) {
    console.log("[ERROR_CONNECTING_TO_DATABASE/NATS_SERVER", error);
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
};

start();
