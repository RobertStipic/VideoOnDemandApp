import { Listener } from "@robstipic/middlewares";
import { Subscription } from "../../models/subscription.js";

export class AccountDeletedListener extends Listener {
async onMessage(data, msg) {

    await Subscription.deleteOne({ userId: data.id });

    msg.ack();
}
  }

