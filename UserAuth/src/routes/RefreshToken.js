import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const RefreshTokenRouter = express.Router();

RefreshTokenRouter.post("/users/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).send("No refresh token provided");
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).send("Invalid or expired refresh token");
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).send("User not found");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "15m" },
    );

    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(500).send("Unexpected refresh error");
  }
});

export { RefreshTokenRouter };
