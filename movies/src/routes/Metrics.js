import express from "express";
import { register } from "../metrics.js";

const MetricsRouter = express.Router();

MetricsRouter.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export { MetricsRouter };
