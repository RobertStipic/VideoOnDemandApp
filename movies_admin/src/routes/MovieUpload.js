import express from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import {
  currentUser,
  adminAuthorization,
  Subjects,
} from "@robstipic/middlewares";
import { natsWrapperClient } from "../nats-wrapper.js";
import { MovieUploadedPublisher } from "../events/publishers/movie-uploaded-publisher.js";

const uploadMovieRouter = express.Router();

const storage = multer.diskStorage({
  destination: "/app/src/movies",
  filename: (req, file, cb) => {
    const normalized = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_.-]/g, "");
    cb(null, normalized);
  },
});

const upload = multer({ storage });

uploadMovieRouter.post(
  "/movies-admin/upload",
  currentUser,
  adminAuthorization,
  upload.single("video"),
  [
    body("Title")
      .exists({ checkFalsy: true })
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string")
      .trim(),

    body("Year")
      .exists({ checkFalsy: true })
      .withMessage("Year is required")
      .isInt()
      .withMessage("Year must be number"),

    body("Rated")
      .exists({ checkFalsy: true })
      .withMessage("Rated is required")
      .isString()
      .withMessage("Rated must be a string"),

    body("Released")
      .exists({ checkFalsy: true })
      .withMessage("Released is required")
      .isString()
      .withMessage("Released must be a string"),

    body("Runtime")
      .exists({ checkFalsy: true })
      .withMessage("Runtime is required")
      .isString()
      .withMessage("Runtime must be a string"),

    body("Genre")
      .exists({ checkFalsy: true })
      .withMessage("Genre is required")
      .isString()
      .withMessage("Genre must be a string"),

    body("Director")
      .exists({ checkFalsy: true })
      .withMessage("Director is required")
      .isString()
      .withMessage("Director must be a string"),

    body("Writer")
      .exists({ checkFalsy: true })
      .withMessage("Writer is required")
      .isString()
      .withMessage("Writer must be a string"),

    body("Actors")
      .exists({ checkFalsy: true })
      .withMessage("Actors is required")
      .isString()
      .withMessage("Actors must be a string"),

    body("Plot")
      .exists({ checkFalsy: true })
      .withMessage("Plot is required")
      .isString()
      .withMessage("Plot must be a string"),

    body("Language")
      .exists({ checkFalsy: true })
      .withMessage("Language is required")
      .isString()
      .withMessage("Language must be a string"),

    body("Country")
      .exists({ checkFalsy: true })
      .withMessage("Country is required")
      .isString()
      .withMessage("Country must be a string"),

    body("Awards")
      .exists({ checkFalsy: true })
      .withMessage("Awards is required")
      .isString()
      .withMessage("Awards must be a string"),

    body("Poster")
      .exists({ checkFalsy: true })
      .withMessage("Poster is required")
      .isString()
      .withMessage("Poster must be a string")
      .isURL()
      .withMessage("Poster must be a valid URL"),

    body("Ratings_0_Source")
      .exists({ checkFalsy: true })
      .withMessage("Ratings_0_Source is required")
      .isString()
      .withMessage("Ratings_0_Source must be a string"),

    body("Ratings_0_Value")
      .exists({ checkFalsy: true })
      .withMessage("Ratings_0_Value is required")
      .isString()
      .withMessage("Ratings_0_Value must be a string"),

    body("imdbRating")
      .exists({ checkFalsy: true })
      .withMessage("imdbRating is required")
      .isString()
      .withMessage("imdbRating must be a string"),

    body("imdbVotes")
      .exists({ checkFalsy: true })
      .withMessage("imdbVotes is required")
      .isString()
      .withMessage("imdbVotes must be a string"),

    body("imdbID")
      .exists({ checkFalsy: true })
      .withMessage("imdbID is required")
      .matches(/^tt\d+$/)
      .withMessage("imdbID must be in format tt<number>"),

    body("Type")
      .exists({ checkFalsy: true })
      .withMessage("Type is required")
      .isIn(["movie", "series", "episode"])
      .withMessage("Type must be movie, series or episode"),

    body("DVD")
      .exists({ checkFalsy: true })
      .withMessage("DVD is required")
      .isString()
      .withMessage("DVD must be a string"),

    body("BoxOffice")
      .exists({ checkFalsy: true })
      .withMessage("BoxOffice is required")
      .isString()
      .withMessage("BoxOffice must be a string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    if (!req.file) {
      return res.status(400).send("Video file required");
    }

    const movieData = {
      ...req.body,
      Path: req.file.filename,
    };

    await new MovieUploadedPublisher(
      natsWrapperClient.jsClient,
      Subjects.MovieUploaded,
    ).publish(movieData);

    res.status(201).send(`Movie uploaded: ${req.file.filename}`);
  },
);

export { uploadMovieRouter };
