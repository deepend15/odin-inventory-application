import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  studio_id INTEGER,
  genre_1_id INTEGER,
  genre_2_id INTEGER,
  year INTEGER,
  stock INTEGER,
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
    ('missing', 'missing'),
    ('Paramount Pictures', 'paramount-pictures'),
    ('Disney', 'disney'),
    ('Sony', 'sony'),
    ('Warner Bros.', 'warner-bros'),
    ('A24', 'a24'),
    ('New Line Cinema', 'new-line-cinema'),
    ('Universal', 'universal'),
    ('20th Century Studios', '20th-century-studios'),
    ('Amazon MGM Studios', 'amazon-mgm-studios'),
    ('Lionsgate', 'lionsgate'),
    ('Searchlight Pictures', 'searchlight-pictures');

INSERT INTO genres (genre, url_path)
  VALUES
    ('missing', 'missing'),
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
    ('Western', 'western'),
    ('Family', 'family');

INSERT INTO movies (title, studio_id, genre_1_id, genre_2_id, year, stock, url_path)
  VALUES
    ('The Godfather', 2, 5, 13, 1972, 5, 'the-godfather'),
    ('Coco', 3, 4, 12, 2017, 10, 'coco'),
    ('Spider-Man (2002)', 4, 2, NULL, 2002, 10, 'spider-man-2002'), 
    ('Harry Potter and the Sorceror''s Stone', 5, 7, 18, 2001, 15, 'harry-potter-and-the-sorcerors-stone'),
    ('Everything Everywhere All At Once', 6, 2, 3, 2022, 10, 'everything-everywhere-all-at-once'),
    ('The Notebook', 7, 6, NULL, 2004, 15, 'the-notebook'),
    ('28 Days Later', 12, 10, NULL, 2002, 10, '28-days-later'),
    ('28 Weeks Later', 9, 10, NULL, 2007, 5, '28-weeks-later'),
    ('How To Train Your Dragon (2010)', 2, 4, 2, 2010, 15, 'how-to-train-your-dragon-2010'),
    ('How To Train Your Dragon (2025)', 8, 2, 18, 2025, 20, 'how-to-train-your-dragon-2025'),
    ('Murder on the Orient Express', 9, 14, NULL, 2017, 10, 'murder-on-the-orient-express'),
    ('Past Lives', 6, 5, NULL, 2023, 5, 'past-lives'),
    ('Schindler''s List', 8, 5, 16, 1993, 5, 'schindlers-list'),
    ('Spider-Man: Homecoming', 4, 2, NULL, 2017, 15, 'spider-man%3A-homecoming'),
    ('The Hunger Games', 11, 2, NULL, 2012, 10, 'the-hunger-games');
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
