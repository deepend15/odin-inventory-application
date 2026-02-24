import express from "express";
import path from "node:path";
// import router(s)
import { CustomNotFoundError } from "./errors/CustomNotFoundError.js";

const app = express();

const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

// app.use() / router(s) info

// 404 error
app.use((req, res, next) => {
  next(new CustomNotFoundError("Page not found."));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.statusCode) {
    res.status(err.statusCode).send(`${err.statusCode} Error: ${err.message}`);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Listening on port ${PORT}!`);
});
