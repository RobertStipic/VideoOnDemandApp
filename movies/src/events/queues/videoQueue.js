import Queue from "bull";

const REDIS_URL = process.env.REDIS_URL;

export const videoQueue = new Queue("video-transcode", REDIS_URL);
