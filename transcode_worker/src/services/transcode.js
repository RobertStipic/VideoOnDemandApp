import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { removeAllFilesSync } from "./deleteFiles.js";
import { formatDuration } from "./formatDuration.js";

ffmpeg.setFfmpegPath(ffmpegStatic);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoPath = path.join(__dirname, "..", "movies");
const outputPath = path.join(__dirname, "..", "output");

const scale = "scale=1280:720";
const videoCodec = "libx264";
const x264Options = "keyint=24:min-keyint=24:no-scenecut";
const videoBitrates = "2000k";

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export async function processMovie(movie) {
  const moviePath = movie.Path;
  const newMovieName = movie.imdbID + ".mpd";
  const title = movie.Title;
  const folderPath = path.join(outputPath, movie.imdbID);

  if (fs.existsSync(folderPath)) {
    console.log(`Movie ${title} (${movie.imdbID}) already encoded, skipping`);
    return;
  }

  await videosTranscoding(moviePath, newMovieName, title);
}

async function videosTranscoding(moviePath, newMovieName, title) {
  const filename = path.basename(newMovieName, ".mpd");
  let totalTime;
  const startTime = Date.now();

  try {
    console.log(
      `Transcoding movie ${title} : ${moviePath} to ${newMovieName}...`,
    );
    console.log(`Input file: ${path.join(videoPath, moviePath)}`);
    fs.mkdirSync(path.join(outputPath, filename), { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(videoPath, moviePath))
        .videoFilters(scale)
        .videoCodec(videoCodec)
        .addOption("-x264opts", x264Options)
        .outputOptions("-b:v", videoBitrates)
        .format("dash")
        .outputOptions([`-use_template 1`, `-use_timeline 1`])
        .output(path.join(outputPath, filename, newMovieName))
        .on("start", () => console.log(`Movie ${title} transcoding started...`))
        .on("codecData", (data) => {
          totalTime = parseInt(data.duration.replace(/:/g, ""));
        })
        .on("progress", (progress) => {
          if (!totalTime) return;
          const time = parseInt(progress.timemark.replace(/:/g, ""));
          const percent = (time / totalTime) * 100;
          console.log(
            `Transcoding progress: ${percent.toFixed(2)} % for ${title}`,
          );
        })
        .on("end", () => {
          const durationMS = Date.now() - startTime;
          console.log(
            `Transcoding completed for ${title} in ${formatDuration(durationMS)} || file used: ${moviePath}`,
          );
          resolve();
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err.message);
          console.error("FFmpeg error code:", err.code);
          removeAllFilesSync(path.join(outputPath, filename));
          reject(err.message);
        })
        .run();
    });
  } catch (error) {
    console.error("Encoding video files error:", error);
    throw error;
  }
}
