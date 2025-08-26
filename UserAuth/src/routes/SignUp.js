import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { natsWrapperClient } from "../nats-wrapper.js";
import { UserAuthPublisher } from "../events/publishers/user-auth-publisher.js";
import { Subjects } from "@robstipic/middlewares";
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
      .isAlpha("sr-RS@latin")
      .withMessage(constantsSignUP.cityMessage),
    body(constantsSignUP.gender)
      .exists({ checkFalsy: true })
      .withMessage(constantsSignUP.genderMessage)
      .isIn(constants.genderArray)
      .withMessage(constantsSignUP.genderValidMessage),
  ],
  async (req, res) => {
    try{
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
    await User.create({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      country,
      city,
      gender,
    });
    const user = await User.findOne({ email });

    //Json Web Token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '12h' }
    );
    //process.env.JWT_PRIVATE_KEY is saved in secret inside kubernetes cluster
    req.session.jwt = userJwt;
    new UserAuthPublisher(
      natsWrapperClient.jsClient,
      Subjects.UserAuth
    ).publish({
      id: user.id,
      email: user.email,
      type: constants.activity.registration,
    });

    res.status(201).send(user);
  }catch (error) {
      res.status(500).send("Unexpected sign up error");
    }
  }
);

export { SignUpRouter };
