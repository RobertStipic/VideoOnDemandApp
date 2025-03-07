import { Movie } from "../models/movie.js";
import csvtojson from "csvtojson";
import * as path from "path";
import { fileURLToPath } from "url";
import { constants } from "../consants/general.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(
  __dirname,
  "..",
  "csv",
  "MOVIES_WATCH_DATA_final.csv"
);

export async function initizializeCSV() {
  //await Movie.deleteMany({}); //test function
  let count = await Movie.countDocuments();
  if (count === constants.numbers.empty) {
    console.log("Importing csv data from: ", csvFilePath);
    await CSVtoDatabase();
    return console.log("All movies inserted in database");
  } else if (count === constants.numbers.MoviesCount)
    console.log("Movie collection have all CSV records loaded");
  else
    console.log(
      "Number of records in Database doesnt match value set by application: ",
      constants.numbers.MoviesCount
    );
}
async function CSVtoDatabase() {
  return new Promise((resolve, reject) => {
    try {
      csvtojson()
        .fromFile(csvFilePath, { encoding: constants.encoding })
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
