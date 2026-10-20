import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { PasswordEncription } from "../services/passwordHash.js";
import { UserAuthPublisher } from "../events/publishers/user-auth-publisher.js";
import { Subjects } from "@robstipic/middlewares";
import { constantsRoutes, constants } from "../consants/general.js";

const LogInRouter = express.Router();

LogInRouter.post(
  "/users/login",
  [
    body(constantsRoutes.email)
      .isEmail()
      .withMessage(constantsRoutes.emailMessage),
    body(constantsRoutes.password)
      .trim()
      .notEmpty()
      .withMessage(constantsRoutes.passwordMessage),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }
      const { email, password } = req.body;

      const existingEmail = await User.findOne({ email });
      if (!existingEmail) {
        return res
          .status(404)
          .send("Provided information doesn't match any record");
      }
      if (!existingEmail.isActive) {
        return res.status(403).send("Account not activated. Check your email.");
      }

      const passwordsMatch = await PasswordEncription.comparePassword(
        password,
        existingEmail.password,
      );

      if (!passwordsMatch) {
        return res
          .status(404)
          .send("Provided information doesn't match any record");
      }
      const accessToken = jwt.sign(
        {
          id: existingEmail.id,
          email: existingEmail.email,
          role: existingEmail.role,
          isActive: existingEmail.isActive,
        },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { id: existingEmail.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      new UserAuthPublisher(
        natsWrapperClient.jsClient,
        Subjects.UserAuth,
      ).publish({
        id: existingEmail.id,
        email,
        type: constants.activity.login,
      });

      res.status(200).send({
        existingEmail,
        accessToken,
      });
    } catch (error) {
      res.status(500).send("Unexpected log in error");
    }
  },
);

export { LogInRouter };
