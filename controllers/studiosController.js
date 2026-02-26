import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString } from "./urlEncoding.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allStudiosGet(req, res) {
  const studios = await db.getAllStudios();
  res.render("studios/allStudios", {
    title: "Studios",
    studios: studios,
  });
}

async function singleStudioGet(req, res) {
  const { studioPath } = req.params;
  const encodedPath = encodeString(studioPath);
  const { studio } = await db.getStudioName(encodedPath);
  const movies = await db.getStudioMovies(studio);
  res.render("studios/singleStudio", {
    title: studio,
    movies: movies,
  });
}

export { allStudiosGet, singleStudioGet };
