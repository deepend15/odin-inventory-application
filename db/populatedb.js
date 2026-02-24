import { Client } from "pg";

// const SQL = `
// CREATE TABLE IF NOT EXISTS [tableName] (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//    [column info]
// );

// INSERT INTO [tableName] ([columns])
// VALUES
//   ([value info])
// `;

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
