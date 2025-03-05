import { Movie } from "../models/movie.js";
import csvtojson from "csvtojson";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(
  __dirname,
  "..",
  "csv",
  "MOVIES_WATCH_DATA_final.csv"
);
const empty = 0;
const MoviesCount = 100;

export async function initizializeCSV() {
  //await Movie.deleteMany({}); //test function
  let count = await Movie.countDocuments();
  if (count === empty) {
    console.log("Importing csv data from: ", csvFilePath);
    await CSVtoDatabase();
    return console.log("All movies inserted in database");
  } else if (count === MoviesCount)
    console.log("Movie collection have all CSV records loaded");
  else
    console.log(
      "Number of records in Database doesnt match value set by application: ",
      MoviesCount
    );
}
async function CSVtoDatabase() {
  return new Promise((resolve, reject) => {
    try {
      csvtojson()
        .fromFile(csvFilePath, { encoding: "utf-8" })
        .then((csvData) => {
          for (let i = 0; i < csvData.length; i++) {
            let temp = {};
            temp.Title = csvData[i]["Title"];
            temp.Year = csvData[i]["Year"];
            temp.Runtime = csvData[i]["Runtime"];
            temp.movieId = csvData[i]["imdbID"];
            temp.Poster = csvData[i]["Poster"];
            Movie.create(temp);
          }
          resolve();
        });
    } catch (err) {
      console.log(err);
    }
  });
}
