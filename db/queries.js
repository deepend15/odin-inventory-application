import pool from "./pool.js";

async function getAllMovies() {
  const { rows } = await pool.query("SELECT * FROM movies ORDER BY title");
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre");
  return rows;
}

async function getGenreMovies(genre) {}

async function getAllStudios() {
  const { rows } = await pool.query("SELECT * FROM studios ORDER BY studio");
  return rows;
}

async function getStudioMovies() {}

export {
  getAllMovies,
  getAllGenres,
  getGenreMovies,
  getAllStudios,
  getStudioMovies,
};
