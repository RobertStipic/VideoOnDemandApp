import express from "express";
import crypto from "node:crypto";
import { User } from "../models/user.js";

const ActivateAccountRouter = express.Router();

ActivateAccountRouter.get("/users/activate", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(
        `${process.env.CLIENT_URL}/user/signin?error=no-token`,
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      activationToken: hashedToken,
      activationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/user/signin?error=invalid-token`,
      );
    }

    user.isActive = true;
    user.activationToken = null;
    user.activationExpiresAt = null;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/user/signin?activated=true`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/user/signin?error=server-error`);
  }
});

export { ActivateAccountRouter };
