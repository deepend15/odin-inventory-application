import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  studio_id INTEGER,
  genre_1_id INTEGER,
  genre_2_id INTEGER,
  year INTEGER,
  stock INTEGER DEFAULT 5,
  url_path VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS studios (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  studio VARCHAR (255),
  url_path VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre VARCHAR (255),
  url_path VARCHAR ( 255 )
);

INSERT INTO studios (studio, url_path)
  VALUES
    ('Paramount Pictures', 'paramount-pictures'),
    ('Disney', 'disney'),
    ('Sony', 'sony'),
    ('Warner Bros.', 'warner-bros'),
    ('A24', 'a24'),
    ('New Line Cinema', 'new-line-cinema'),
    ('Universal', 'universal');

INSERT INTO genres (genre, url_path)
  VALUES
    ('Action/Adventure', 'action%2Fadventure'),
    ('Sci-Fi', 'sci-fi'),
    ('Animated', 'animated'),
    ('Drama', 'drama'),
    ('Romance', 'romance'),
    ('Fantasy', 'fantasy'),
    ('Comedy', 'comedy'),
    ('Documentary', 'documentary'),
    ('Horror', 'horror'),
    ('Thriller', 'thriller'),
    ('Musical', 'musical'),
    ('Crime', 'crime'),
    ('Mystery', 'mystery'),
    ('Sports', 'sports'),
    ('War', 'war'),
    ('Western', 'western');

INSERT INTO movies (title, studio_id, genre_1_id, genre_2_id, year, url_path)
  VALUES
    ('The Godfather', 1, 4, 12, 1972, 'the-godfather'),
    ('Coco', 2, 3, 11, 2017, 'coco'),
    ('Spider-Man (2002)', 3, 1, NULL, 2002, 'spider-man-2002'), 
    ('Harry Potter and the Sorceror''s Stone', 4, 6, NULL, 2001, 'harry-potter-and-the-sorcerors-stone'),
    ('Everything Everywhere All At Once', 5, 1, 2, 2022, 'everything-everywhere-all-at-once'),
    ('The Notebook', 6, 5, NULL, 2004, 'the-notebook');
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
