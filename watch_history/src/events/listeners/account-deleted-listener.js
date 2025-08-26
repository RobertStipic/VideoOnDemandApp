import { Listener } from "@robstipic/middlewares";
import { WatchHistory } from "../../models/watch_history.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {
      try{
        await WatchHistory.deleteOne({ userId: data.id });

    msg.ack();
  }    catch (error) {
        console.error("Error processing account deleted event", error)
      }
}
  }

