import express from "express";
import crypto from "node:crypto";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { Subjects } from "@robstipic/middlewares";
import { UserActivationPublisher } from "../events/publishers/user-activation-publisher.js";
import { constants, constantsRoutes } from "../consants/general.js";

const ResendActivationRouter = express.Router();

ResendActivationRouter.post(
  "/users/resend-activation",
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
        return res
          .status(200)
          .send("If account exists, activation email was sent");
      }

      if (user.isActive) {
        return res.status(400).send("Account is already activated");
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.activationToken = hashedToken;
      user.activationExpiresAt = new Date(Date.now() + 24 * constants.oneHour);
      await user.save();

      await new UserActivationPublisher(
        natsWrapperClient.jsClient,
        Subjects.UserAccountActivated,
      ).publish({
        email: user.email,
        firstName: user.firstName,
        token: rawToken,
      });

      res.status(200).send("If account exists, activation email was sent");
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error");
    }
  },
);

export { ResendActivationRouter };
