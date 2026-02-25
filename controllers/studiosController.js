import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allStudiosGet(req, res) {
  // WIP
  const studios = [];
  res.render("studios", {
    title: "Studios",
    studios: studios,
  });
}

export { allStudiosGet };
