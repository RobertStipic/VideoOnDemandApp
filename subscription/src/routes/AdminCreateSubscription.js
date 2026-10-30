import express from "express";
import { body, validationResult } from "express-validator";
import { adminAuthorization, Subjects } from "@robstipic/middlewares";
import { Subscription } from "../models/subscription.js";
import { natsWrapperClient } from "../nats-wrapper.js";
import { SubscriptionAdminCreatedPublisher } from "../events/publisher/subscription-admin-created-publisher.js";
import { constants } from "../constants/general.js";
import { calculateExpiration } from "../services/calculateSubscription.js";

const adminCreateRouter = express.Router();

adminCreateRouter.post(
  "/subscription/admin/create",
  adminAuthorization,
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("plan")
      .isInt({ min: constants.plan.min, max: constants.plan.max })
      .withMessage("Plan must be 1, 2 or 3"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      const { email, plan } = req.body;

      let userData;
      try {
        const response = await natsWrapperClient.client.request(
          "user.get.by.email",
          natsWrapperClient.jsonCodec.encode({ email }),
          { timeout: 5000 },
        );
        userData = natsWrapperClient.jsonCodec.decode(response.data);
      } catch (err) {
        if (err.code === "503" || err.code === "TIMEOUT") {
          return res.status(503).send("User service unavailable");
        }
        return res.status(500).send("Error communicating with user service");
      }

      if (userData.error) {
        return res.status(404).send(userData.error);
      }

      const userId = userData.userId;

      const activeSub = await Subscription.findOne({
        userId,
        status: constants.status.succeeded,
      });

      if (activeSub) {
        return res.status(400).send("User already has an active subscription");
      }

      const expiresAt = calculateExpiration(plan);

      const subscription = await Subscription.create({
        userId,
        userEmail: email,
        plan,
        price: 0,
        status: constants.status.succeeded,
        expiresAt,
        paymentExpiresAt: expiresAt,
      });

      await new SubscriptionAdminCreatedPublisher(
        natsWrapperClient.jsClient,
        Subjects.SubscriptionAdminCreated,
      ).publish({
        subscriptionId: subscription.id,
        userId,
        userEmail: email,
        plan,
        expiresAt,
        createdBy: req.currentUser.email,
        paymentId: null,
      });

      console.log(
        `[subscription] Admin created subscription ${subscription.id} for ${email} (by ${req.currentUser.email})`,
      );

      res.status(201).send({ subscription });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating subscription");
    }
  },
);

export { adminCreateRouter };
