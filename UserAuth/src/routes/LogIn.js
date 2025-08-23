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

    const passwordsMatch = PasswordEncription.comparePassword(
      password,
      existingEmail.password
    );

    if (!passwordsMatch) {
      return res
        .status(404)
        .send("Provided information doesn't match any record");
    }
    const userJwt = jwt.sign(
      {
        id: existingEmail.id,
        email: existingEmail.email,
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '12h' }
    );
    
    req.session.jwt = userJwt;
    console.log(
      "Publisher data",
      "id",
      existingEmail.id,
      "email",
      email,
      "login"
    );
    new UserAuthPublisher(
      natsWrapperClient.jsClient,
      Subjects.UserAuth
    ).publish({
      id: existingEmail.id,
      email,
      type: constants.activity.login,
    });

    res.status(200).send(existingEmail);
  }
);

export { LogInRouter };
