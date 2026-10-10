import { Listener } from "@robstipic/middlewares";
import { Movie } from "../../models/movie.js";

export class MovieUploadedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID, Title, Year, Runtime, Poster } = data;
      const existing = await Movie.findOne({ movieId: imdbID });
      if (existing) {
        console.log(`Movie ${imdbID} already exists, skipping`);
        msg.ack();
        return;
      }

      await Movie.create({
        movieId: imdbID,
        Title,
        Year,
        Runtime,
        Poster,
      });
      msg.ack();
    } catch (error) {
      console.error("Error processing movie uploaded event", error);
    }
  }
}
