import pool from "./pool.js";

async function getAllMovies() {
  const { rows } = await pool.query("SELECT * FROM movies ORDER BY title");
  return rows;
}

async function getSingleMovie(moviePath) {
  const { rows } = await pool.query(
    `SELECT
      movies.title,
      studios.studio,
      a.genre AS genre_1,
      b.genre AS genre_2,
      movies.year,
      movies.stock,
      studios.url_path AS studio_path,
      a.url_path AS genre_1_path,
      b.url_path AS genre_2_path
    FROM movies
    INNER JOIN studios ON studios.id = movies.studio_id
    INNER JOIN genres a ON a.id = movies.genre_1_id
    LEFT OUTER JOIN genres b ON b.id = movies.genre_2_id
    WHERE movies.url_path = '${moviePath}'`,
  );
  return rows[0];
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre");
  return rows;
}

async function getGenreName(genrePath) {
  const { rows } = await pool.query(
    `SELECT genre FROM genres WHERE url_path = '${genrePath}'`,
  );
  return rows[0];
}

async function getGenreMovies(genre) {
  const { rows } = await pool.query(
    `SELECT movies.title, movies.url_path
    FROM movies
    INNER JOIN genres a ON a.id = movies.genre_1_id
    LEFT OUTER JOIN genres b ON b.id = movies.genre_2_id
    WHERE a.genre = '${genre}' OR b.genre = '${genre}'
    ORDER BY movies.title`,
  );
  return rows;
}

async function getAllStudios() {
  const { rows } = await pool.query("SELECT * FROM studios ORDER BY studio");
  return rows;
}

async function getStudioName(studioPath) {
  const { rows } = await pool.query(
    `SELECT studio FROM studios WHERE url_path = '${studioPath}'`,
  );
  return rows[0];
}

async function getStudioMovies(studioName) {
  const { rows } = await pool.query(
    `SELECT movies.title, movies.url_path
    FROM movies
    INNER JOIN studios ON studios.id = movies.studio_id
    WHERE studios.studio = '${studioName}'
    ORDER BY movies.title`,
  );
  return rows;
}

export {
  getAllMovies,
  getSingleMovie,
  getAllGenres,
  getGenreName,
  getGenreMovies,
  getAllStudios,
  getStudioName,
  getStudioMovies,
};
