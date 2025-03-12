import { Listener } from "@robstipic/middlewares";
import { UserActivity } from "../../models/user_activity.js";

export class UserAuthListener extends Listener {
  async onMessage(data, msg) {
    await UserActivity.updateOne(
      { userEmail: data.email },
      {
        $push: {
          login_history: { userId: data.id, activityType: data.type },
        },
      },
      { upsert: true }
    );
    console.log(
      "User logged:",
      data.email,
      "current time:",
      new Date(),
      "type:",
      data.type
    );
    msg.ack();
  }
}
