import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { UserAuthPublisher } from "../events/publishers/user-auth-publisher.js";
import { UserActivationPublisher } from "../events/publishers/user-activation-publisher.js";
import { Subjects } from "@robstipic/middlewares";
import crypto from "node:crypto";
import {
  constantsSignUP,
  constants,
  constantsRoutes,
} from "../consants/general.js";
const SignUpRouter = express.Router();

SignUpRouter.post(
  "/users/signup",
  [
    body(constantsRoutes.email)
      .isEmail()
      .withMessage(constantsRoutes.emailMessage),
    body(constantsRoutes.password)
      .exists({ checkFalsy: true })
      .withMessage(constantsRoutes.passwordMessage)
      .isString()
      .withMessage(constantsSignUP.passwordTypeMessage)
      .isLength({ min: 8, max: 20 })
      .withMessage(constantsSignUP.passwordLengthMessage),
    body(constantsSignUP.firstName)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.firstNameMessage)
      .isAlpha("sr-RS@latin")
      .withMessage(constantsSignUP.firstNameValidMessage),
    body(constantsSignUP.lastName)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.lastNameMessage)
      .isAlpha("sr-RS@latin")
      .withMessage(constantsSignUP.lastNameValidMessage),
    body(constantsSignUP.dateOfBirth)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.dateOfBirthMessage)
      .isDate()
      .withMessage(constantsSignUP.dateOfBirthFormatMessage)
      .custom((value) => {
        let userDate = new Date(value);
        let todayDate = new Date();
        let nowYear = todayDate.getFullYear();
        let nowMonth = todayDate.getMonth();
        let nowDay = todayDate.getDate();
        let userAge = userDate.getFullYear();
        let userMonth = userDate.getMonth();
        let userDay = userDate.getDate();

        if (
          (nowYear - userAge == 18 &&
            nowMonth - userMonth <= 0 &&
            nowDay - userDay <= 0) ||
          nowYear - userAge < 18
        ) {
          throw new Error("User must be 18 years or older");
        }
        return true;
      }),
    body(constantsSignUP.country)
      .isISO31661Alpha2()
      .withMessage(constantsSignUP.countryMessage),
    body(constantsSignUP.city)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.cityMessage2)
      .isAlpha("sr-RS@latin")
      .withMessage(constantsSignUP.cityMessage),
    body(constantsSignUP.gender)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.genderMessage)
      .isIn(constants.genderArray)
      .withMessage(constantsSignUP.genderValidMessage),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        country,
        city,
        gender,
      } = req.body;
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(409).send("Email already exist");
      }
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        country,
        city,
        gender,
        activationToken: hashedToken,
        activationExpiresAt: new Date(Date.now() + 24 * constants.oneHour),
      });

      await new UserActivationPublisher(
        natsWrapperClient.jsClient,
        Subjects.UserAccountActivated,
      ).publish({
        email: user.email,
        firstName: user.firstName,
        token: rawToken,
      });

      new UserAuthPublisher(
        natsWrapperClient.jsClient,
        Subjects.UserAuth,
      ).publish({
        id: user.id,
        email: user.email,
        type: constants.activity.registration,
      });

      res.status(201).send({
        user,
        message: "Account created. Check your email to activate.",
      });
    } catch (error) {
      res.status(500).send("Unexpected sign up error");
    }
  },
);

export { SignUpRouter };
