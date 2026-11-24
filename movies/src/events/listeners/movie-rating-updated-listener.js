import { Listener } from "@robstipic/middlewares";
import { Movie } from "../../models/movies.js";

export class MovieRatingUpdatedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { movieId, averageRating, reviewCount } = data;

      await Movie.updateOne(
        { imdbID: movieId },
        { averageRating, reviewCount },
      );

      console.log(
        `[movies] Updated rating for ${movieId}: ${averageRating} (${reviewCount} reviews)`,
      );
      msg.ack();
    } catch (error) {
      console.error("[movies] Error updating rating:", error);
    }
  }
}
