import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import convertToPath from "./convertToPath.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allStudiosGet(req, res) {
  // WIP
  const studios = [
    {
      studio: "Disney",
    },
    {
      studio: "Warner Bros",
    },
  ];
  studios.forEach((studio) => {
    studio.path = convertToPath(studio.studio);
  });
  res.render("studios", {
    title: "Studios",
    studios: studios,
  });
}

export { allStudiosGet };
