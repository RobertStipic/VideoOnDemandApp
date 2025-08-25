import { Listener } from "@robstipic/middlewares";
import { UserActivity } from "../../models/user_activity.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {

    await UserActivity.deleteOne({ "login_history.userId": data.id });

    msg.ack();
}
  }

