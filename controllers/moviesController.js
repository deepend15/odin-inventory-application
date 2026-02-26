import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString } from "./urlEncoding.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allMoviesGet(req, res) {
  const movies = await db.getAllMovies();
  res.render("movies/allMovies", {
    title: "All movies",
    movies: movies,
  });
}

async function singleMovieGet(req, res) {
  const { moviePath } = req.params;
  const encodedPath = encodeString(moviePath);
  const movie = await db.getSingleMovie(encodedPath);
  res.render("movies/singleMovie", {
    movie: movie,
  });
}

export { allMoviesGet, singleMovieGet };
