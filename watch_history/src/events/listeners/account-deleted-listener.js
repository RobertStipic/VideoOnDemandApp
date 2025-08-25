import { Listener } from "@robstipic/middlewares";
import { WatchHistory } from "../../models/watch_history.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {

    await WatchHistory.deleteOne({ userId: data.id });

    msg.ack();
}
  }

