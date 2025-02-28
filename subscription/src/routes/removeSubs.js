import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";

const removeRouter = express.Router();

removeRouter.delete("/subscription/:id", async (req, res) => {
  res.send({});
});

export { removeRouter };
