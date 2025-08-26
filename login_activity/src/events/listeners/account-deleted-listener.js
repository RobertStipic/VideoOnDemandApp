import { Listener } from "@robstipic/middlewares";
import { UserActivity } from "../../models/user_activity.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {
    try {
    await UserActivity.deleteOne({ "login_history.userId": data.id });

    msg.ack();
    }
    catch (error) {
        console.error("Error processing account deleted event", error)
      }
}
  }

