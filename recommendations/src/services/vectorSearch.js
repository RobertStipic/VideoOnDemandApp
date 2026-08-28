import { MongoClient } from "mongodb";
import { getEmbedding } from "./getEmbeddings.js";
import { constants } from "../constants/general.js";
const client = new MongoClient(process.env.MONGOATLAS_URL);
const database = client.db(process.env.DATABASE_NAME);
const collection = database.collection(process.env.COLLECTION_NAME);
export async function searchQuery(query) {
  try {
    await client.connect();

    const queryEmbedding = await getEmbedding(query);
    // create pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: constants.vector.name,
          queryVector: queryEmbedding,
          path: constants.vector.path,
          exact: true,
          limit: 9,
        },
      },
      {
        $project: {
            _id: 0, Plot: 1, Title: 1, Poster: 1, Year: 1, Runtime: 1,
            Genre: 1, Actors: 1, Language: 1, imdbRating: 1, imdbID: 1,
          score: {
            $meta: constants.vector.meta,
          },
        },
      },
    ];

    const result = collection.aggregate(pipeline);

    let resultsArray = [];
    for await (const doc of result) {
      resultsArray.push(doc);
    }
    return resultsArray;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
