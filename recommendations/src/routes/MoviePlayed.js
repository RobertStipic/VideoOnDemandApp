import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { constants } from "../constants/general.js";
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

      const { id } = req.params;

      const record = await collection.findOne({
        imdbID: id,
      });

      const pipeline = [
        {
          $vectorSearch: {
            index: constants.vector.name,
            queryVector: record.embedding,
            path: constants.vector.path,
            exact: true,
            limit: 4,
          },
        },
        { $match: { imdbID: { $ne: id } } },
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

      res.send(resultsArray);
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  }
);

export { MoviePlayedRouter };
