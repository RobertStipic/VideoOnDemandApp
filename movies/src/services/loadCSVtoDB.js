import { Movie } from "../models/movies.js";
import csvtojson from "csvtojson";
import * as path from "path";
import { fileURLToPath } from "url";
import { constants } from "../constants/general.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "..", "csv", "MOVIES_DATA_final.csv");

export async function initizializeCSV() {
  try {
    const count = await Movie.countDocuments();

    if (count === constants.empty) {
      console.log("Database empty, importing CSV from:", csvFilePath);
      await CSVtoDatabase(constants.columns);
      console.log("All movies inserted in database");
    } else {
      console.log(`Database has ${count} records, skipping CSV import`);
    }
  } catch (error) {
    console.error("Error while initizialing CSV", error);
  }
}
async function CSVtoDatabase(columns) {
  try {
    const csvData = await csvtojson().fromFile(csvFilePath, {
      encoding: "utf-8",
    });
    const movies = csvData.map((row) => {
      const temp = {};
      columns.forEach((column) => {
        temp[column] = row[column];
      });
      return temp;
    });
    await Movie.insertMany(movies);
    console.log(`Inserted ${movies.length} movies`);
  } catch (error) {
    console.error("Error while inserting CSV to database", error);
  }
}
