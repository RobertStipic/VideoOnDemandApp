import Queue from "bull";
import { processMovie } from "../services/transcode.js";
import { Movie } from "../models/movies.js";

const REDIS_URL = process.env.REDIS_URL;

export const videoQueue = new Queue("video-transcode", REDIS_URL);

videoQueue.process("transcode", 1, async (job) => {
  const { imdbID } = job.data;
  console.log(`processing job for ${imdbID}`);

  const movie = await Movie.findOne({ imdbID });
  if (!movie) {
    throw new Error(`Movie with imdbID ${imdbID} not found in DB`);
  }

  await processMovie(movie);
  return { imdbID, done: true };
});

videoQueue.on("failed", (job, err) => {
  console.error(`failed: ${job.data.imdbID}`, err.message);
});
