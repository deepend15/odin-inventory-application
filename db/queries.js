import pool from "./pool.js";

async function getAllMovies() {
  const { rows } = await pool.query("SELECT * FROM movies ORDER BY title");
  return rows;
}

async function getSingleMovie(moviePath) {
  const { rows } = await pool.query(
    `SELECT
      movies.id AS movie_id,
      movies.title,
      studios.studio,
      a.genre AS genre_1,
      b.genre AS genre_2,
      movies.year,
      movies.stock,
      movies.url_path AS movie_path,
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

async function checkForDupeMovie(moviePath, id) {
  if (id) {
    const { rows } = await pool.query(
      `SELECT * FROM movies WHERE url_path = '${moviePath}' AND id <> '${id}'`,
    );
    return rows;
  }
  const { rows } = await pool.query(
    `SELECT * FROM movies WHERE url_path = '${moviePath}'`,
  );
  return rows;
}

async function addMovie(
  title,
  studioId,
  genre1Id,
  genre2Id,
  year,
  stock,
  moviePath,
) {
  await pool.query(
    "INSERT INTO movies (title, studio_id, genre_1_id, year, stock, url_path) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, studioId, genre1Id, year, stock, moviePath],
  );
  if (genre2Id) {
    await pool.query("UPDATE movies SET genre_2_id = $1 WHERE url_path = $2", [
      genre2Id,
      moviePath,
    ]);
  }
}

async function updateMovie(
  originalMovieId,
  title,
  studioId,
  genre1Id,
  genre2Id,
  year,
  stock,
  newMoviePath,
) {
  await pool.query(
    "UPDATE movies SET title = $1, studio_id = $2, genre_1_id = $3, year = $4, stock = $5, url_path = $6 WHERE id = $7",
    [title, studioId, genre1Id, year, stock, newMoviePath, originalMovieId],
  );
  if (genre2Id) {
    await pool.query("UPDATE movies SET genre_2_id = $1 WHERE id = $2", [
      genre2Id,
      originalMovieId,
    ]);
  } else {
    await pool.query("UPDATE movies SET genre_2_id = NULL WHERE id = $1", [
      originalMovieId,
    ]);
  }
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY genre");
  return rows;
}

async function getGenreId(genreName) {
  const { rows } = await pool.query(
    `SELECT id FROM genres WHERE genre = '${genreName}'`,
  );
  return rows[0].id;
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

async function getStudioId(studioName) {
  const { rows } = await pool.query(
    `SELECT id FROM studios WHERE studio = '${studioName}'`,
  );
  return rows[0].id;
}

async function getSingleStudio(studioPath) {
  const { rows } = await pool.query(
    `SELECT * FROM studios WHERE url_path = '${studioPath}'`,
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

async function checkForDupeStudio(studioPath, studioId) {
  if (studioId) {
    const { rows } = await pool.query(
      `SELECT * FROM studios WHERE url_path = '${studioPath}' AND id <> '${studioId}'`,
    );
    return rows;
  }
  const { rows } = await pool.query(
    `SELECT * FROM studios WHERE url_path = '${studioPath}'`,
  );
  return rows;
}

async function addStudio(studio, studioPath) {
  await pool.query("INSERT INTO studios (studio, url_path) VALUES ($1, $2)", [
    studio,
    studioPath,
  ]);
}

async function updateStudio(originalStudioId, studioName, studioPath) {
  await pool.query(
    "UPDATE studios SET studio = $1, url_path = $2 WHERE id = $3",
    [studioName, studioPath, originalStudioId],
  );
}

export {
  getAllMovies,
  getSingleMovie,
  checkForDupeMovie,
  addMovie,
  updateMovie,
  getAllGenres,
  getGenreId,
  getGenreName,
  getGenreMovies,
  getAllStudios,
  getStudioId,
  getSingleStudio,
  getStudioMovies,
  checkForDupeStudio,
  addStudio,
  updateStudio,
};
