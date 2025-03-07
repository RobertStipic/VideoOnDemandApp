import express from "express";
import { body, validationResult } from "express-validator";
import { userAuthorization, currentUser } from "@robstipic/middlewares";
import { User } from "../models/user.js";
import { PasswordEncription } from "../services/passwordHash.js";
import {
  constantsChangePassword,
  constantsRoutes,
} from "../consants/general.js";

const ChangePasswordRouter = express.Router();

ChangePasswordRouter.patch(
  "/users/changepassword",
  [
    body(constantsRoutes.password)
      .trim()
      .notEmpty()
      .withMessage(constantsRoutes.passwordMessage),
    body(constantsChangePassword.newPassword)
      .trim()
      .notEmpty()
      .withMessage(constantsChangePassword.newPasswordMessage),
    body(constantsChangePassword.confirmNewPassword)
      .trim()
      .notEmpty()
      .withMessage(constantsChangePassword.confirmNewPasswordMessage),
  ],
  currentUser,
  userAuthorization,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { email } = req.currentUser;
    const { password, newPassword, confirmNewPassword } = req.body;
    if (password === newPassword) {
      return res.status(400).send("New password is same as current password");
    } else if (newPassword === confirmNewPassword) {
      const user = await User.findOne({ email });
      const passwordsMatch = PasswordEncription.comparePassword(
        password,
        user.password
      );
      if (!passwordsMatch) {
        return res
          .status(400)
          .send("Provided current password doesn't match user password");
      }
      const doc = await User.findOne({ email: email });
      doc.password = newPassword;
      doc.save();
    } else {
      res.status(400).send("New passwords doesn't match");
    }
    res.status(200).send("Password succesfully changed");
  }
);

export { ChangePasswordRouter };
