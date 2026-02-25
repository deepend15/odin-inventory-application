import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import convertToPath from "./convertToPath.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allGenresGet(req, res) {
  // WIP
  const genres = [
    {
      genre: "Action/Adventure",
    },
    {
      genre: "Comedy",
    },
  ];
  genres.forEach((genre) => {
    genre.path = convertToPath(genre.genre);
  });
  res.render("genres", {
    title: "Genres",
    genres: genres,
  });
}

export { allGenresGet };
