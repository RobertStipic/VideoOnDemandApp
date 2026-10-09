import { Listener } from "@robstipic/middlewares";
import { Movie } from "../../models/movies.js";
import { videoQueue } from "../../events/queues/videoQueue.js";

export class MovieUploadedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID } = data;
      const existing = await Movie.findOne({ imdbID });
      if (existing) {
        console.log(`Movie ${imdbID} already exists, skipping`);
        msg.ack();
        return;
      }
      await Movie.create(data);
      await videoQueue.add("transcode", { imdbID });
      msg.ack();
    } catch (error) {
      console.error("Error processing movie uploaded event", error);
    }
  }
}
