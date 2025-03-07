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
          limit: 8,
        },
      },
      {
        $project: {
          _id: 0,
          Plot: 1,
          Title: 1,
          Poster: 1,
          score: {
            $meta: constants.vector.meta,
          },
        },
      },
    ];

    const result = collection.aggregate(pipeline);

    console.log("Search results for term: " + query);
    let resultsArray = [];
    for await (const doc of result) {
      console.log(`\nTitle: ${doc.Title}`);
      console.log(`Plot: ${doc.Plot}`);
      console.log(`Poster: ${doc.Poster}`);
      console.log(`Score: ${(doc.score * 100).toFixed(2)}% match`);
      resultsArray.push(doc);
    }
    return resultsArray;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
