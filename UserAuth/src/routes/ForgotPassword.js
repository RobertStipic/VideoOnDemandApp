import express from "express";
import crypto from "node:crypto";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { Subjects } from "@robstipic/middlewares";
import { constants, constantsRoutes } from "../consants/general.js";
import { UserPasswordResetPublisher } from "../events/publishers/user-password-reset-publisher.js";

const ForgotPasswordRouter = express.Router();

ForgotPasswordRouter.post(
  "/users/forgot-password",
  [
    body(constantsRoutes.email)
      .isEmail()
      .withMessage(constantsRoutes.emailMessage),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).send("If email exists, reset link was sent");
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.passwordResetToken = hashedToken;
      user.passwordResetExpiresAt = new Date(Date.now() + constants.oneHour);
      await user.save();

      await new UserPasswordResetPublisher(
        natsWrapperClient.jsClient,
        Subjects.UserPasswordReset,
      ).publish({
        email: user.email,
        firstName: user.firstName,
        token: rawToken,
      });

      res.status(200).send("If email exists, reset link was sent");
    } catch (error) {
      res.status(500).send("Unexpected error while reseting password");
    }
  },
);

export { ForgotPasswordRouter };
