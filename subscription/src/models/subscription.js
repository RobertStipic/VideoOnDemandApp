import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
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
      enum: ["pending", "cancelled", "failed", "succeeded"],
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
