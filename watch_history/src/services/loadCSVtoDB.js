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
const columns = ["Title", "Year", "Runtime", "imdbID", "Poster"];
export async function initizializeCSV() {
  //await Movie.deleteMany({}); //test function
  let count = await Movie.countDocuments();
  if (count === constants.numbers.empty) {
    console.log("Importing csv data from: ", csvFilePath);
    await CSVtoDatabase(columns);
    return console.log("All movies inserted in database");
  } else if (count === constants.numbers.MoviesCount)
    console.log("Movie collection have all CSV records loaded");
  else
    console.log(
      "Number of records in Database doesnt match value set by application: ",
      constants.numbers.MoviesCount
    );
}

async function CSVtoDatabase(columns) {
  return new Promise((resolve, reject) => {
    try {
      csvtojson()
        .fromFile(csvFilePath, { encoding: "utf-8" })
        .then((csvData) => {
          csvData.forEach((row) => {
            const temp = {};
            columns.forEach((column) => {
              temp[column] = row[column];
            });
            Movie.create(temp);
            console.log("Movie inserted in database: ", temp.Title);
          });
          resolve();
        });
    } catch (err) {
      console.log(err);
    }
  });
}
