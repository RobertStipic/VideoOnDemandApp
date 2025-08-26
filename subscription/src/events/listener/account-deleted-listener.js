import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {
  try{
    await Subscription.deleteMany({ userId: data.id });

    msg.ack();
    }   catch (error) {
        console.error("Error processing account deleted event", error);
      }
}
  }

