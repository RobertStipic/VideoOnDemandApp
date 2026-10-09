import { Listener } from "@robstipic/middlewares";
import { getEmbedding } from "../../services/getEmbeddings.js";
import { constants } from "../../constants/general.js";
import { client } from "../../db.js";

export class MovieUploadedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID, Plot } = data;
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);

      const existing = await collection.findOne({ imdbID });
      if (existing) {
        console.log(`Movie ${imdbID} already exists, skipping`);
        msg.ack();
        return;
      }
      const embedding = await getEmbedding(Plot);

      const temp = {};

      constants.columns.forEach((column) => {
        if (column === "Plot") {
          temp[column] = Plot;
          temp.embedding = embedding;
        } else {
          temp[column] = data[column];
        }
      });

      await collection.insertOne(temp);
      msg.ack();
    } catch (error) {
      console.error("Error processing movie uploaded event", error);
    }
  }
}
