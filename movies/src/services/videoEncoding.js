import { Movie } from "../models/movies.js";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from "url";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static'
import { removeAllFilesSync } from "./deleteFiles.js";

ffmpeg.setFfmpegPath(ffmpegStatic);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const output = path.join(__dirname, '..', 'output');
const videoPath = path.join(__dirname, '..', 'movies');
const outputPath = path.join(__dirname, '..', 'output');;
const scale = 'scale=1280:720';
const videoCodec = 'libx264';
const x264Options = 'keyint=24:min-keyint=24:no-scenecut';
const videoBitrates = '2000k';


  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  } 



export async function startEncoding(){

   const movies = await Movie.find({},
      { imdbID: 1, Path: 1, Title: 1, _id: 0 }
      );
      for (const movie of movies) {
        await processMovie(movie);
      }
    };


  async function processMovie(movie) {
    const moviePath = movie.Path;
    const newMovieName = movie.imdbID;
    const title = movie.Title;
    const folderPath = path.join(outputPath, movie.imdbID);

    
    if (fs.existsSync(folderPath)) {
    console.log(`Movie ${movie.Title} (${movie.imdbID}) already encoded`);
    return
  }

    await videosTranscoding(videoPath, moviePath, newMovieName, outputPath, title);
}
 


async function videosTranscoding(
  videoPath,
  moviePath,
  newMovieName,
  outputPath,
  title
) {
  let filename = path.basename(newMovieName, ".mpd");
  let totalTime;

  try {


    console.log(`Transcoding movie ${title} : ${moviePath} to ${newMovieName}...`);
    console.log(`Input file: ${path.join(videoPath, moviePath)}`);
    console.log(
      `Output file: ${path.join(outputPath, filename, newMovieName)}`
    );
    console.log("dirname: ", __dirname);
    console.log(`Filename: ${filename}`);


    fs.mkdirSync(path.join(outputPath, filename), { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(videoPath, moviePath))
        .videoFilters(scale)
        .videoCodec(videoCodec)
        .addOption("-x264opts", x264Options)
        .outputOptions("-b:v", videoBitrates)
        .format("dash")
        .outputOptions([
          `-use_template 1`,
          `-use_timeline 1`,
        ])
        .output(path.join(outputPath, filename, newMovieName))
        .on("start", () => {
          console.log(`Movie ${title} transcoding started...`);
        })
        .on("codecData", (data) => {
          totalTime = parseInt(data.duration.replace(/:/g, ""));
        })
        .on("progress", (progress) => {
          const time = parseInt(progress.timemark.replace(/:/g, ""));
          const percent = (time / totalTime) * 100;
          console.log(
            `Transcoding progress: ${percent.toFixed(2)} % for ${title}`
          );
        })
        .on("end", () => {
          console.log(
            "Transcoding using DASH protocol completed for movie " +
              title +
              " || file used: " +
              moviePath
          );
          resolve();
        })
        .on("error", (err) => {
          console.error("FFmpeg error:", err.message);
          console.error("FFmpeg stdout:", err.stdout);
          console.error("FFmpeg stderr:", err.stderr);
          console.error("FFmpeg error code:", err.code);
          deleteonfail(outputPath);
          reject(err.message);
        })
        .run();
      console.log(`Transcoding completed successfully for: ${newMovieName}`);
    });
  }  catch(error) {
    console.error("Encoding video files error:", error);
        removeAllFilesSync(outputPath);
      process.exit(1);
  } 
}