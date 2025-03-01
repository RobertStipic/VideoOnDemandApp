import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const StripePaymentSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    stripeID: {
      type: String,
      required: true,
    },
    paymentTime: {
      type: Date,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    payment_info: {
      amount: {
        type: Number,
        required: true,
      },
      amount_captured: {
        type: Number,
        required: false,
      },
      currency: {
        type: String,
        required: true,
      },
      fee: {
        type: Number,
        required: false,
      },
      review: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      paid: {
        type: Boolean,
        required: false,
      },
      description: {
        type: String,
        required: true,
      },
    },
    payment_method_details: {
      type: {
        type: String,
        required: false,
      },
      card: {
        type: String,
        required: false,
      },
      card_last4: {
        type: String,
        required: false,
      },
      card_exp_month: {
        type: Number,
        required: false,
      },
      card_exp_year: {
        type: Number,
        required: false,
      },
      network: {
        type: String,
        required: false,
      },
      funding: {
        type: String,
        required: false,
      },
    },
    receipt_info: {
      receipt_email: {
        type: String,
        required: false,
      },
      receipt_url: {
        type: String,
        required: false,
      },
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
StripePaymentSchema.set("versionKey", "version");
StripePaymentSchema.plugin(updateIfCurrentPlugin);
const StripePayment = mongoose.model("Payment", StripePaymentSchema);

export { StripePayment };
