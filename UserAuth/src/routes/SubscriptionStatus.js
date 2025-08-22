import express from "express";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/users/:id/subscription", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send({ isSubscribed: user.isSubscribed });
  } catch (err) {
    res.status(500).send("Error checking subscription");
  }
});

export { router as SubscriptionStatusRouter };