import { Listener } from "@robstipic/middlewares";
import { UserActivity } from "../../models/user_activity.js";

export class UserAuthListener extends Listener {
  async onMessage(data, msg) {
    try{
    await UserActivity.updateOne(
      { userEmail: data.email },
      {
        $push: {
          login_history: { userId: data.id, activityType: data.type },
        },
      },
      { upsert: true }
    );
    const date = new Date();
    console.log(
      "User logged:",
      data.email,
      "at time:",
      date.toUTCString(),
      "type:",
      data.type
    );
    msg.ack();
    }    catch (error) {
        console.error("Error processing login activity event", error)
      }
  }
}
