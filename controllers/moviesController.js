import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString, convertToPath } from "./urlEncoding.js";
import { validatePassword } from "./passwordValidator.js";

async function allMoviesGet(req, res) {
  if (req.query.delete) {
    return res.render("movies/deleteMovieSuccess");
  }

  let missingDataMovies;
  const results = await db.getMissingDataMovies();
  if (results.length > 0) missingDataMovies = results;

  if (req.query.search || req.query.search === "") {
    if (req.query.search === "") {
      return res.render("movies/searchResults", {
        title: "All movies",
        searchResults: [],
        searchInputValue: "",
        missingDataMovies: missingDataMovies,
      });
    }
    const searchedTitle = req.query.search;
    const searchResults = await db.getSearchResults(searchedTitle);
    return res.render("movies/searchResults", {
      title: "All movies",
      searchResults: searchResults,
      searchInputValue: searchedTitle,
      missingDataMovies: missingDataMovies,
    });
  }

  const movies = await db.getAllMovies();
  res.render("movies/allMovies", {
    title: "All movies",
    movies: movies,
    missingDataMovies: missingDataMovies,
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

async function addMovieGet(req, res) {
  const studios = await db.getAllStudios();
  const genres = await db.getAllGenres();
  let studioValue = "";
  let genre1Value = "";
  if (req.query.studio) {
    const encodedPath = encodeString(req.query.studio);
    const studio = await db.getSingleStudio(encodedPath);
    studioValue = studio.studio;
  }
  if (req.query.genre) {
    const encodedPath = encodeString(req.query.genre);
    const genre = await db.getSingleGenre(encodedPath);
    genre1Value = genre.genre;
  }
  res.render("movies/addMovie", {
    title: "Add movie",
    studios: studios,
    genres: genres,
    titleValue: "",
    studioValue: studioValue,
    genre1Value: genre1Value,
    genre2Value: "",
    yearValue: "",
    stockValue: "",
  });
}

const emptyErr = "cannot be empty.";
const titleErr = "cannot be more than 255 characters.";
const genre2Err = "cannot be the same as the primary genre.";
const yearErr = "must be a number between 1878 and 2500.";
const stockErr = "must be a number between 1 and 2000.";

const validateMovie = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(`Title ${emptyErr}`)
    .isLength({ max: 255 })
    .withMessage(`Title ${titleErr}`),
  body("studio").notEmpty().withMessage(`Studio ${emptyErr}`),
  body("genre1").notEmpty().withMessage(`Primary genre ${emptyErr}`),
  body("genre2")
    .optional({ values: "falsy" })
    .custom((value, { req }) => {
      return value !== req.body.genre1;
    })
    .withMessage(`Secondary genre ${genre2Err}`),
  body("year")
    .trim()
    .isInt({ min: 1878, max: 2500 })
    .withMessage(`Year ${yearErr}`),
  body("stock")
    .trim()
    .isInt({ min: 1, max: 200 })
    .withMessage(`Number in stock ${stockErr}`),
];

const addMoviePost = [
  validateMovie,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const studios = await db.getAllStudios();
      const genres = await db.getAllGenres();
      const { title, studio, genre1, genre2, year, stock } = req.body;
      return res.status(400).render("movies/addMovie", {
        title: "Add movie",
        studios: studios,
        genres: genres,
        titleValue: title,
        studioValue: studio,
        genre1Value: genre1,
        genre2Value: genre2,
        yearValue: year,
        stockValue: stock,
        errors: errors.array(),
      });
    }
    const { title, studio, genre1, genre2, year, stock } = matchedData(req);
    const moviePath = convertToPath(title);
    const dupe = await db.checkForDupeMovie(moviePath);
    if (dupe.length > 0) {
      const studios = await db.getAllStudios();
      const genres = await db.getAllGenres();
      const { title, studio, genre1, genre2, year, stock } = req.body;
      return res.status(400).render("movies/addMovie", {
        title: "Add movie",
        studios: studios,
        genres: genres,
        titleValue: title,
        studioValue: studio,
        genre1Value: genre1,
        genre2Value: genre2,
        yearValue: year,
        stockValue: stock,
        dupeType: "movie",
        dupeName: dupe[0].title,
        dupePath: `/movies/${dupe[0].url_path}`,
      });
    }
    const studioId = await db.getStudioId(studio);
    const genre1Id = await db.getGenreId(genre1);
    let genre2Id;
    if (genre2) genre2Id = await db.getGenreId(genre2);
    await db.addMovie(
      title,
      studioId,
      genre1Id,
      genre2Id,
      Number(year),
      Number(stock),
      moviePath,
    );
    res.redirect(`/movies/${moviePath}`);
  },
];

async function editMovieGet(req, res) {
  const { moviePath } = req.params;
  const encodedPath = encodeString(moviePath);
  const movie = await db.getSingleMovie(encodedPath);
  const studios = await db.getAllStudios();
  const genres = await db.getAllGenres();
  res.render("movies/editMovie", {
    title: "Edit movie",
    headingMovieTitle: movie.title,
    movie: movie,
    studios: studios,
    genres: genres,
  });
}

const editMoviePost = [
  [...validatePassword, ...validateMovie],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { moviePath } = req.params;
      const encodedPath = encodeString(moviePath);
      const originalMovie = await db.getSingleMovie(encodedPath);
      const submittedData = req.body;
      const studios = await db.getAllStudios();
      const genres = await db.getAllGenres();
      return res.status(400).render("movies/editMovie", {
        title: "Edit movie",
        headingMovieTitle: originalMovie.title,
        movie: {
          title: submittedData.title,
          studio: submittedData.studio,
          genre_1: submittedData.genre1,
          genre_2: submittedData.genre2,
          year: submittedData.year,
          stock: submittedData.stock,
          movie_path: originalMovie.movie_path,
        },
        studios: studios,
        genres: genres,
        errors: errors.array(),
      });
    }
    const originalMoviePath = req.params.moviePath;
    const originalMovieEncodedPath = encodeString(originalMoviePath);
    const originalMovie = await db.getSingleMovie(originalMovieEncodedPath);
    const { title, studio, genre1, genre2, year, stock } = matchedData(req);
    const newMoviePath = convertToPath(title);
    const dupe = await db.checkForDupeMovie(
      newMoviePath,
      originalMovie.movie_id,
    );
    if (dupe.length > 0) {
      const studios = await db.getAllStudios();
      const genres = await db.getAllGenres();
      return res.status(400).render("movies/editMovie", {
        title: "Edit movie",
        headingMovieTitle: originalMovie.title,
        movie: {
          title: title,
          studio: studio,
          genre_1: genre1,
          genre_2: genre2,
          year: year,
          stock: stock,
          movie_path: originalMovie.movie_path,
        },
        studios: studios,
        genres: genres,
        dupeType: "movie",
        dupeName: dupe[0].title,
        dupePath: `/movies/${dupe[0].url_path}`,
      });
    }
    const studioId = await db.getStudioId(studio);
    const genre1Id = await db.getGenreId(genre1);
    let genre2Id;
    if (genre2) genre2Id = await db.getGenreId(genre2);
    await db.updateMovie(
      originalMovie.movie_id,
      title,
      studioId,
      genre1Id,
      genre2Id,
      Number(year),
      Number(stock),
      newMoviePath,
    );
    res.redirect(`/movies/${newMoviePath}`);
  },
];

async function deleteMovieGet(req, res) {
  const { moviePath } = req.params;
  const encodedPath = encodeString(moviePath);
  const movie = await db.getSingleMovie(encodedPath);
  res.render("movies/deleteMovie", {
    title: "Delete movie",
    movie: movie,
  });
}

const deleteMoviePost = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    const { moviePath } = req.params;
    const encodedPath = encodeString(moviePath);
    const movie = await db.getSingleMovie(encodedPath);
    if (!errors.isEmpty()) {
      return res.status(400).render("movies/deleteMovie", {
        title: "Delete movie",
        movie: movie,
        errors: errors.array(),
      });
    }
    await db.deleteMovie(encodedPath);
    res.redirect("/movies?delete=true");
  },
];

export {
  allMoviesGet,
  singleMovieGet,
  addMovieGet,
  addMoviePost,
  editMovieGet,
  editMoviePost,
  deleteMovieGet,
  deleteMoviePost,
};
