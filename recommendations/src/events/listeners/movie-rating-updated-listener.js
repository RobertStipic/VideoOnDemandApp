import { Listener } from "@robstipic/middlewares";
import { client } from "../../db.js";

export class MovieRatingUpdatedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { movieId, averageRating, reviewCount } = data;
      const db = client.db(process.env.DATABASE_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);

      await collection.updateOne(
        { imdbID: movieId },
        { $set: { averageRating, reviewCount } },
      );

      console.log(
        `[recommendations] Updated rating for ${movieId}: ${averageRating} (${reviewCount} reviews)`,
      );
      msg.ack();
    } catch (error) {
      console.error("[recommendations] Error updating rating:", error);
    }
  }
}
