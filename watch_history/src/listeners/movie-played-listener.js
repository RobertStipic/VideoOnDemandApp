import { Listener } from "@robstipic/middlewares";
import { Movie } from "../models/movie.js";
import { WatchHistory } from "../models/watch_history.js";

export class MoviePlayedListener extends Listener {
  async onMessage(data, msg) {
    const movieMetadata = await Movie.findOne({
      movieId: data.imbdId,
    });
    if (!movieMetadata) {
      throw new Error("Movie not found");
    }
    await WatchHistory.updateOne(
      { userId: data.userId },
      {
        $push: {
          watch_history: { movieId: data.imbdId, watchedAt: new Date() },
        },
      },
      { upsert: true },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            "Updated watch history for user: ",
            data.userId,
            "and movie: ",
            data.imbdId,
            "with result: ",
            new Date()
          );
        }
      }
    );
    msg.ack();
  }
}
