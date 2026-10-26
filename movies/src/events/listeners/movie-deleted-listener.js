import { Listener } from "@robstipic/middlewares";
import { Movie } from "../../models/movies.js";

export class MovieDeletedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID } = data;
      await Movie.deleteOne({ imdbID });
      msg.ack();
    } catch (error) {
      console.error("Error while deleting movie:", error);
    }
  }
}
