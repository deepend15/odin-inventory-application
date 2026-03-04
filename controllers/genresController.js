import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString, convertToPath } from "./urlEncoding.js";
import { validatePassword } from "./passwordValidator.js";

async function allGenresGet(req, res) {
  const genres = await db.getAllGenres();
  let includeMissing;
  const missingGenreMovies = await db.checkForMissingGenreMovies();
  if (missingGenreMovies.length > 0) includeMissing = true;
  res.render("genres/allGenres", {
    title: "Genres",
    genres: genres,
    includeMissing: includeMissing,
  });
}

async function singleGenreGet(req, res) {
  const { genrePath } = req.params;
  const encodedPath = encodeString(genrePath);
  const { genre } = await db.getSingleGenre(encodedPath);
  const movies = await db.getGenreMovies(genre);
  res.render("genres/singleGenre", {
    title: genre,
    movies: movies,
    genrePath: encodedPath,
  });
}

async function addGenreGet(req, res) {
  res.render("genres/addGenre", {
    title: "Add genre",
    genreValue: "",
  });
}

const validateGenre = [
  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre cannot be empty.")
    .isLength({ max: 255 })
    .withMessage("Genre cannot be more than 255 characters.")
    .custom((value) => {
      return value.toLowerCase() !== "missing";
    })
    .withMessage(`Genre cannot be set to "Missing."`),
];

const addGenrePost = [
  [...validateGenre, ...validatePassword],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("genres/addGenre", {
        title: "Add genre",
        genreValue: req.body.genre,
        errors: errors.array(),
      });
    }
    const { genre } = matchedData(req);
    const genrePath = convertToPath(genre);
    const dupe = await db.checkForDupeGenre(genrePath);
    if (dupe.length > 0) {
      return res.status(400).render("genres/addGenre", {
        title: "Add genre",
        genreValue: req.body.genre,
        dupeType: "genre",
        dupePath: `/genres/${dupe[0].url_path}`,
        dupeName: dupe[0].genre,
      });
    }
    await db.addGenre(genre, genrePath);
    res.redirect(`/genres/${genrePath}`);
  },
];

async function editGenreGet(req, res) {
  const { genrePath } = req.params;
  const encodedPath = encodeString(genrePath);
  const genre = await db.getSingleGenre(encodedPath);
  res.render("genres/editGenre", {
    title: "Edit genre",
    genre: genre,
    genreInputValue: genre.genre,
  });
}

const editGenrePost = [
  [...validateGenre, ...validatePassword],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { genrePath } = req.params;
      const encodedPath = encodeString(genrePath);
      const originalGenre = await db.getSingleGenre(encodedPath);
      const submittedData = req.body;
      return res.status(400).render("genres/editGenre", {
        title: "Edit genre",
        genre: originalGenre,
        genreInputValue: submittedData.genre,
        errors: errors.array(),
      });
    }
    const originalGenrePath = req.params.genrePath;
    const originalGenreEncodedPath = encodeString(originalGenrePath);
    const originalGenre = await db.getSingleGenre(originalGenreEncodedPath);
    const { genre } = matchedData(req);
    const newGenrePath = convertToPath(genre);
    const dupe = await db.checkForDupeGenre(newGenrePath, originalGenre.id);
    if (dupe.length > 0) {
      return res.status(400).render("genres/editGenre", {
        title: "Edit genre",
        genre: originalGenre,
        genreInputValue: genre,
        dupeType: "genre",
        dupePath: `/genres/${dupe[0].url_path}`,
        dupeName: dupe[0].genre,
      });
    }
    await db.updateGenre(originalGenre.id, genre, newGenrePath);
    res.redirect(`/genres/${newGenrePath}`);
  },
];

export {
  allGenresGet,
  singleGenreGet,
  addGenreGet,
  addGenrePost,
  editGenreGet,
  editGenrePost,
};
