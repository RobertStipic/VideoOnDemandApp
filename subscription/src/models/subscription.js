import mongoose from "mongoose";
import { constants } from "../consants/general.js";
const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    paymentExpiresAt: {
      type: Date,
      required: true,
    },
    plan: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        constants.status.pending,
        constants.status.cancelled,
        constants.status.failed,
        constants.status.succeeded,
      ],
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.version = ret.__v;
        delete ret._id;
        delete ret.__v;
      },
      versionKey: false,
    },
  }
);

const Subscription = mongoose.model("Subscriptions", SubscriptionSchema);

export { Subscription };
