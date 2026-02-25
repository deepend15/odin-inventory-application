import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allMoviesGet(req, res) {
  // WIP
  const movies = [];
  res.render("movies", {
    title: "All movies",
    movies: movies,
  });
}

export { allMoviesGet };
