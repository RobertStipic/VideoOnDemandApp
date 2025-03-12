import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import mongose from "mongoose";
import cookieSession from "cookie-session";
import { initizializeCSV } from "./services/loadCSVtoDB.js";
import { MoviesByLanguageRouter } from "./routes/MoviesByLanguage.js";
import { MoviesByGenreRouter } from "./routes/MoviesByGenre.js";
import { ListMoviesRouter } from "./routes/ListMovies.js";
import { MoviesByYearRouter } from "./routes/MoviesByYear.js";
import { SendMovieRouter } from "./routes/SendMovie.js";
import { currentUser } from "@robstipic/middlewares";
import { startEncoding } from "./services/videoEncoding.js";
import { natsWrapperClient } from "./nats-client.js";
import { PlayMovieRouter } from "./routes/PlayMovie.js";

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
app.use(MoviesByLanguageRouter);
app.use(MoviesByGenreRouter);
app.use(ListMoviesRouter);
app.use(MoviesByYearRouter);
app.use(PlayMovieRouter);
app.use(SendMovieRouter);
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
    throw new Error("NATS_URL_IS_REQUIRED");
  }
  try {
    await natsWrapperClient.connect(process.env.NATS_URL);
    console.log("connected to NATS");
    process.on("SIGINT", () => natsWrapperClient.close());
    process.on("SIGTERM", () => natsWrapperClient.close());

    await mongose.connect(process.env.DATABASE_URL);

    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });

  await initizializeCSV();
  startEncoding();
};

startApp();
