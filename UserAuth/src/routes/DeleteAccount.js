import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { PasswordEncription } from "../services/passwordHash.js";
import { constantsRoutes, constants } from "../consants/general.js";

const DeleteRouter = express.Router();

DeleteRouter.delete(
  "/users/delete",
  [
    body(constantsRoutes.password)
      .trim()
      .notEmpty()
      .withMessage(constantsRoutes.passwordMessage),
    body(constantsRoutes.confirmPassword)
      .trim()
      .notEmpty()
      .withMessage(constantsRoutes.confirmPasswordMessage)
      .custom((value, { req }) => {
            if (value !== req.body[constantsRoutes.password]) {
            throw new Error("Passwords doesnt match");
            }
            return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .send("Provided information doesn't match any record");
    }

    const passwordsMatch = PasswordEncription.comparePassword(
      password,
      existingUser.password
    );

    if (!passwordsMatch) {
      return res
        .status(404)
        .send("Provided information doesn't match any record");
    }
 
    req.session = null;
    await existingUser.deleteOne();


    res.status(200).send("Account deleted");
  }
);

export { DeleteRouter };
