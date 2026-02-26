import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  movie VARCHAR ( 255 ),
  studio_id INTEGER,
  genre_1_id INTEGER,
  genre_2_id INTEGER,
  year INTEGER,
  stock INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS studios (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  studio VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre VARCHAR (255)
);

INSERT INTO studios (studio)
  VALUES
    ('Paramount Pictures'),
    ('Disney'),
    ('Sony'),
    ('Warner Bros.'),
    ('A24'),
    ('New Line Cinema'),
    ('Universal');

INSERT INTO genres (genre)
  VALUES
    ('Action/Adventure'),
    ('Sci-Fi'),
    ('Animated'),
    ('Drama'),
    ('Romance'),
    ('Fantasy'),
    ('Comedy'),
    ('Documentary'),
    ('Horror'),
    ('Thriller'),
    ('Musical'),
    ('Crime'),
    ('Mystery'),
    ('Sports'),
    ('War'),
    ('Western');

INSERT INTO movies (title, studio_id, genre_1_id, genre_2_id, year)
  VALUES
    ('The Godfather', 1, 4, 12, 1972),
    ('Coco', 2, 3, 11, 2017),
    ('Spider-Man (2002)', 3, 1, NULL, 2002), 
    ('Harry Potter and the Sorceror''s Stone', 4, 6, NULL, 2001),
    ('Everything Everywhere All At Once', 5, 1, 2, 2022),
    ('The Notebook', 6, 5, NULL, 2004);
`;

async function main() {
  console.log("Seeding...");
  let connectionStringValue;
  if (process.argv.length > 2) connectionStringValue = process.argv[2];
  else connectionStringValue = process.argv[1];
  const client = new Client({
    connectionString: connectionStringValue,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done!");
}

main();
