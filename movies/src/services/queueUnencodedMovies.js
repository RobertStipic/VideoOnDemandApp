import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { Movie } from "../models/movies.js";
import { videoQueue } from "../events/queues/videoQueue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "..", "output");

export async function queueUnencodedMovies() {
  try {
    const movies = await Movie.find({}, { imdbID: 1, Title: 1, _id: 0 });

    let queued = 0;
    let skipped = 0;

    for (const movie of movies) {
      const folderPath = path.join(outputPath, movie.imdbID);

      if (fs.existsSync(folderPath)) {
        skipped++;
        continue;
      }

      await videoQueue.add("transcode", { imdbID: movie.imdbID });
      queued++;
      console.log(`Queued for transcode: ${movie.Title} (${movie.imdbID})`);
    }

    console.log(
      `Bull queued: ${queued}, skipped (already encoded): ${skipped}`,
    );
  } catch (error) {
    console.error("Error while adding movies to Bull Queue", error);
  }
}
