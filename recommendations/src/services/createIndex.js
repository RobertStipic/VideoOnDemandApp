import { MongoClient } from "mongodb";
import { constants } from "../constants/general.js";
const client = new MongoClient(process.env.MONGOATLAS_URL);

export async function createVectorSearch() {
  try {
    const database = client.db(process.env.DATABASE_NAME);
    const collection = database.collection(process.env.COLLECTION_NAME);

    // MongoDB Atlas Vector Search index
    const index = {
      name: constants.vector.name,
      type: constants.vector.type,
      definition: {
        fields: [
          {
            type: constants.vector.filedType,
            path: constants.vector.path,
            similarity: constants.vector.similarity,
            numDimensions: constants.vector.numDimensions,
          },
        ],
      },
    };

    const result = await collection.createSearchIndex(index);
    console.log(result);
  } catch (err) {
    if (err.code === 68) {
      console.log("Vector search index already exists for this database");
    } else {
      console.error(err);
    }
  } finally {
    await client.close();
  }
}
