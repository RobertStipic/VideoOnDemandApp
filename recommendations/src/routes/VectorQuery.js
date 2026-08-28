import express from "express";
import { searchQuery } from "../services/vectorSearch.js";
const VectorQueryRouter = express.Router();

VectorQueryRouter.get(
  "/recommendations/watch",
  async (req, res) => {

     const { term } = req.query; 

     if (!term) {
       return res.status(400).send("Query parameter 'term' is required");
     }

     try {
       const result = await searchQuery(term);
       res.status(200).send(result);
     } catch (error) {
       console.error(error);
       res.status(500).send("Vector query failed");
     }
  }
);
export { VectorQueryRouter };
