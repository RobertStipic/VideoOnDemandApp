import { Movie } from "../models/movies.js";
import csvtojson from "csvtojson";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "..", "csv", "MOVIES_DATA_final.csv");
const empty = 0;
const MoviesCount = 100;
// prettier-ignore
const columns = [
  "Title", "Year", "Rated", "Released", "Runtime", "Genre", "Director", "Writer", "Actors", "Plot",
  "Language", "Country", "Awards", "Poster", "Ratings_0_Source", "Ratings_0_Value", "imdbRating", "imdbVotes", "imdbID",
  "Type", "DVD", "BoxOffice", "Path"
];
export async function initizializeCSV() {
  await Movie.deleteMany({}); //test function
  let count = await Movie.countDocuments();
  if (count === empty) {
    console.log("Importing csv data from: ", csvFilePath);
    await CSVtoDatabase(columns);
    return console.log("All movies inserted in database");
  } else if (count === MoviesCount)
    console.log("Movie collection have all CSV records loaded");
  else
    console.log(
      "Number of records in Database doesnt match value set by application: ",
      MoviesCount
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
