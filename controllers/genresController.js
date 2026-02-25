import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allGenresGet(req, res) {
  // WIP
  const genres = [];
  res.render("genres", {
    title: "Genres",
    genres: genres,
  });
}

export { allGenresGet };
