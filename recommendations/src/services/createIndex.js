import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGOATLAS_URL);

export async function createVectorSearch() {
  try {
    const database = client.db(process.env.DATABASE_NAME);
    const collection = database.collection(process.env.COLLECTION_NAME);

    // MongoDB Atlas Vector Search index
    const index = {
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            similarity: "cosine",
            numDimensions: 1536,
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