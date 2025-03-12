import express from "express";
import "express-async-errors";
import bodyparser from "body-parser";
import cookieSession from "cookie-session";
import { VectorQueryRouter } from "./routes/VectorQuery.js";
import { initializeCSV } from "./services/loadCSVtoDB.js";
import { MoviePlayedRouter } from "./routes/MoviePlayed.js";
import { createVectorSearch } from "./services/createIndex.js";

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
app.use(VectorQueryRouter);
app.use(MoviePlayedRouter);
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});
const startApp = async () => {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error("JWT_PRIVATE_KEY must be defined");
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY must be defined");
  }
  if (!process.env.DATABASE_NAME) {
    throw new Error("DATABASE_NAME must be defined");
  }
  if (!process.env.COLLECTION_NAME) {
    throw new Error("COLLECTION_NAME must be defined");
  }
  if (!process.env.MONGOATLAS_URL) {
    throw new Error("MONGOATLAS_URL must be defined");
  }
  app.listen(3000, () => {
    console.log("Server up and running on port 3000!");
  });
  await initializeCSV();
  createVectorSearch();
};

startApp();
