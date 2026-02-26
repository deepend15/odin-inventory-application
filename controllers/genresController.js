import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString } from "./urlEncoding.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allGenresGet(req, res) {
  const genres = await db.getAllGenres();
  res.render("genres/allGenres", {
    title: "Genres",
    genres: genres,
  });
}

async function singleGenreGet(req, res) {
  const { genrePath } = req.params;
  const encodedPath = encodeString(genrePath);
  const { genre } = await db.getGenreName(encodedPath);
  const movies = await db.getGenreMovies(genre);
  res.render("genres/singleGenre", {
    title: genre,
    movies: movies,
  });
}

export { allGenresGet, singleGenreGet };
