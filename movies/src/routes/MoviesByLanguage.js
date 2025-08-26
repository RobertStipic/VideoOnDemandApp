import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { Movie } from "../models/movies.js";
import { requestLanguages } from "../constants/general.js";
const MoviesByLanguageRouter = express.Router();

//prettier-ignore
MoviesByLanguageRouter.get(
  "/movies/moviesbylanguage",
  [
    body(requestLanguages.language)
      .exists({ checkFalsy: true })
      .withMessage("Please provide language")
      .isIn(requestLanguages.languagesArray)
      .withMessage(requestLanguages.languagesMessage),
  ],
  currentUser,
  userAuthorization,
  async (req, res) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { language } = req.body;
    let movies = await Movie.find(
      { Language: { $regex: language, $options: "i" } },
      { Title: 1, Language: 1 }
    );
    res.status(200).send(movies);
  }catch (error) {
     res.status(500).send("Error while retriving movies by language");
    }
  }
);

export { MoviesByLanguageRouter };
