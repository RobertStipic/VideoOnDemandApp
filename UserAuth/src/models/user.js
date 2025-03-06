import mongoose from "mongoose";
import { PasswordEncription } from "../services/passwordHash.js";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },

      versionKey: false,
    },
  }
);
userSchema.pre("save", function () {
  if (this.isModified("password")) {
    const hashed = PasswordEncription.hashPassword(this.get("password"));
    this.set("password", hashed);
  }
});

const User = mongoose.model("User", userSchema);

export { User };
