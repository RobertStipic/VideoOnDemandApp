import express from "express";
import jwt from "jsonwebtoken";
import { currentUser, adminAuthorization } from "@robstipic/middlewares";
import { User } from "../models/user.js";

const AdminImpersonateRouter = express.Router();

AdminImpersonateRouter.post(
  "/users/admin/impersonate/:id",
  currentUser,
  adminAuthorization,
  async (req, res) => {
    try {
      const { id } = req.params;

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).send("Target user not found");
      }

      if (targetUser.id === req.currentUser.id) {
        return res.status(400).send("Cannot impersonate yourself");
      }

      const impersonationToken = jwt.sign(
        {
          id: targetUser.id,
          email: targetUser.email,
          role: targetUser.role,
          isActive: targetUser.isActive,
          firstName: targetUser.firstName,
          isImpersonation: true,
          impersonatedBy: req.currentUser.email,
        },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "1h" },
      );

      res.cookie("impersonationToken", impersonationToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).send({ impersonationToken, targetUser });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating impersonation token");
    }
  },
);

export { AdminImpersonateRouter };
