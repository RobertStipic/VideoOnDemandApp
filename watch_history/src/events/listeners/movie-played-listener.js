import { Listener } from "@robstipic/middlewares";
import { Movie } from "../../models/movie.js";
import { WatchHistory } from "../../models/watch_history.js";

export class MoviePlayedListener extends Listener {
  async onMessage(data, msg) {
    const movieMetadata = await Movie.findOne({
      movieId: data.movieId,
    });
    if (!movieMetadata) {
      throw new Error("Movie not found");
    }

    await WatchHistory.updateOne(
      { userId: data.userId, userEmail: data.userEmail },
      {
        $push: {
          watch_history: { movieId: data.movieId, watchedAt: new Date() },
        },
      },
      { upsert: true }
    );
    const date = new Date();
    console.log(
      "Updated watch history for user: ",
      data.userId,
      "and movie: ",
      data.movieId,
      "with result: ",
      date.toUTCString()
    );
    msg.ack();
  }
}
