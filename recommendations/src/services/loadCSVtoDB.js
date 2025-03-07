import { MongoClient } from "mongodb";
import csvtojson from "csvtojson";
import * as path from "path";
import { fileURLToPath } from "url";
import { getEmbedding } from "./getEmbeddings.js";
import { constants } from "../constants/general.js";
const client = new MongoClient(process.env.MONGOATLAS_URL);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(
  __dirname,
  "..",
  "csv",
  "MOVIES_RECOMMENDATION_DATA_final.csv"
);

export async function initializeCSV() {
  console.log("Connecting to database: ", process.env.DATABASE_NAME);
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    let count = await collection.countDocuments();
    if (count === constants.numbers.empty) {
      console.log("Importing csv data from: ", csvFilePath);
      await CSVtoDatabase(collection);
      console.log("All movies inserted in database");
    } else {
      console.log("Movie collection already has all CSV records loaded");
    }
  } catch (err) {
    console.error(err);
  }
}

async function CSVtoDatabase(collection) {
  return new Promise((resolve, reject) => {
    try {
      csvtojson()
        .fromFile(csvFilePath, { encoding: constants.encoding })
        .then((csvData) => {
          for (let i = 0; i < csvData.length; i++) {
            getEmbedding(csvData[i]["Plot"]).then((embedding) => {
              let temp = {};
              temp.Title = csvData[i]["Title"];
              temp.Plot = csvData[i]["Plot"];
              temp.Poster = csvData[i]["Poster"];
              temp.imbdID = csvData[i]["imdbID"];
              temp.embedding = embedding;
              collection.insertOne(temp);
              console.log(
                "Movie inserted in database: ",
                i + 1,
                ". ",
                temp.Title
              );
            });
          }
          resolve();
        });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
