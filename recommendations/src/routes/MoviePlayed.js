import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";

const client = new MongoClient(process.env.MONGOATLAS_URL);
const database = client.db(process.env.DATABASE_NAME);
const collection = database.collection(process.env.COLLECTION_NAME);

const MoviePlayedRouter = express.Router();

MoviePlayedRouter.get(
  "/recommendations/:id",
  currentUser,
  userAuthorization,
  async (req, res) => {
    try {
      await client.connect();

      const { id } = req.query;

      const record = await collection.findOne({
        imbdID: id,
      });

      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            queryVector: record.embedding,
            path: "embedding",
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
              $meta: "vectorSearchScore",
            },
          },
        },
      ];

      const result = collection.aggregate(pipeline);

      console.log("Search results for ID: " + id);
      let resultsArray = [];
      for await (const doc of result) {
        console.log(`\nTitle: ${doc.Title}`);
        console.log(`Plot: ${doc.Plot}`);
        console.log(`Poster: ${doc.Poster}`);
        console.log(`Score: ${(doc.score * 100).toFixed(2)}% match`);
        resultsArray.push(doc);
      }

      res.send(resultsArray);
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  }
);

export { MoviePlayedRouter };
