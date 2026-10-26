import { Listener } from "@robstipic/middlewares";
import { client } from "../../db.js";

export class MovieDeletedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID } = data;
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);

      await collection.deleteOne({ imdbID });
      msg.ack();
    } catch (error) {
      console.error("[recommendations] Error deleting movie:", error);
    }
  }
}
