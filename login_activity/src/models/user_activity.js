import mongoose from "mongoose";
import { constants } from "../consants/general.js";

const UserActivitySchema = new mongoose.Schema({
  _id: false,
  userEmail: {
    type: String,
    required: true,
  },
  login_history: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      activityType: {
        type: String,
        required: true,
        enum: [constants.activity.login, constants.activity.registration],
      },
      loggedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      _id: false,
    },
  ],
});
const UserActivity = mongoose.model("UserActivity", UserActivitySchema);

export { UserActivity };
