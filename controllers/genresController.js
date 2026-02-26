import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import convertToPath from "./convertToPath.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allGenresGet(req, res) {
  const genres = await db.getAllGenres();
  genres.forEach((genre) => {
    genre.path = convertToPath(genre.genre);
  });
  res.render("genres", {
    title: "Genres",
    genres: genres,
  });
}

async function singleGenreGet(req, res) {
  // WIP
  const { genre } = req.params;
  console.log(genre);
  res.send("hi");
}

export { allGenresGet, singleGenreGet };
