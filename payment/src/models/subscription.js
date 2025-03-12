import mongoose from "mongoose";
import { constants } from "../consants/general.js";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const Subscriptionchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
        constants.status.expired,
        constants.status.succeeded,
        constants.status.paymentExpired,
      ],
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
Subscriptionchema.set("versionKey", "version");
Subscriptionchema.plugin(updateIfCurrentPlugin);
const Subscription = mongoose.model("Subscription", Subscriptionchema);

export { Subscription };
