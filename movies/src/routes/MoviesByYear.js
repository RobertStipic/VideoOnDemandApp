import express from "express";
import { body, validationResult } from "express-validator";
import { currentUser, userAuthorization } from "@robstipic/middlewares";
import { requestYears } from "../constants/general.js";
import { Movie } from "../models/movies.js";

const MoviesByYearRouter = express.Router();

MoviesByYearRouter.get(
  "/movies/moviesbyyear",
  [
    body(requestYears.year)
      .optional()
      .isInt({ min: requestYears.minValue, max: requestYears.maxValue })
      .withMessage(
        `Valid ${requestYears.year} values: ${requestYears.minValue}-${requestYears.maxValue}`
      ),
    body(requestYears.startyear)
      .optional()
      .isInt({ min: requestYears.minValue, max: requestYears.maxValue })
      .withMessage(
        `Valid ${requestYears.startyear} values: ${requestYears.minValue}-${requestYears.maxValue}`
      ),
    body(requestYears.endyear)
      .optional()
      .isInt({ min: requestYears.minValue, max: requestYears.maxValue })
      .withMessage(
        `Valid ${requestYears.endyear} values: ${requestYears.minValue}-${requestYears.maxValue}`
      ),
    body(requestYears.sorting)
      .optional()
      .isIn(requestYears.sort.values)
      .withMessage(
        `Valid ${requestYears.sorting} values: ${requestYears.sort.ascending} & ${requestYears.sort.descending}`
      ),
  ],
  currentUser,
  userAuthorization,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { year, startyear, endyear, sorting } = req.body;

    if (year && (startyear || endyear)) {
      res
        .status(400)
        .send(
          `You can filter only by ${requestYears.year}, or ${requestYears.startyear}-${requestYears.endyear}(valid values are from: ${requestYears.minValue} to ${requestYears.maxValue})`
        );
    } else if (year) {
      let movies = await Movie.find(
        { Year: { $eq: year } },
        { Title: true, Year: true }
      );
      res.status(200).send(movies);
    } else if (startyear && endyear) {
      const sortOrder = sorting === requestYears.sort.descending ? -1 : 1;

      let movies = await Movie.find({
        Year: { $gte: startyear, $lte: endyear },
      })
        .sort({ Year: sortOrder })
        .select({ Title: true, Year: true });
      res.status(200).send(movies);
    }
  }
);
export { MoviesByYearRouter };
