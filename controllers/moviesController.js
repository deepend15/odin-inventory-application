import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import convertToPath from "./convertToPath.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allMoviesGet(req, res) {
  const movies = await db.getAllMovies();
  movies.forEach((movie) => {
    movie.path = convertToPath(movie.title);
  });
  res.render("movies", {
    title: "All movies",
    movies: movies,
  });
}

export { allMoviesGet };
