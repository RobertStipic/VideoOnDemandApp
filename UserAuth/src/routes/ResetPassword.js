import express from "express";
import crypto from "crypto";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import {
  constantsSignUP,
  constantsChangePassword,
  constantsRoutes,
} from "../consants/general.js";

const ResetPasswordRouter = express.Router();

ResetPasswordRouter.post(
  "/users/reset-password",
  [
    body(constantsRoutes.token)
      .notEmpty()
      .withMessage(constantsRoutes.tokenMessage),
    body(constantsChangePassword.newPassword)
      .exists({ checkFalsy: true })
      .withMessage(constantsChangePassword.newPasswordMessage)
      .isString()
      .withMessage(constantsSignUP.passwordTypeMessage)
      .isLength({ min: 8, max: 20 })
      .withMessage(constantsSignUP.passwordLengthMessage),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send(errors.array());
      }

      const { token, newPassword } = req.body;

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).send("Invalid or expired token");
      }

      user.password = newPassword;
      user.passwordResetToken = null;
      user.passwordResetExpiresAt = null;
      await user.save();

      res.status(200).send("Password reset successful");
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error");
    }
  },
);

export { ResetPasswordRouter };
