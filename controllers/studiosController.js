import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import convertToPath from "./convertToPath.js";

// define validation error messages

// const validateUser = [
//   body functions
// ]

async function allStudiosGet(req, res) {
  const studios = await db.getAllStudios();
  studios.forEach((studio) => {
    studio.path = convertToPath(studio.studio);
  });
  res.render("studios", {
    title: "Studios",
    studios: studios,
  });
}

async function singleStudioGet(req, res) {
  // WIP
  const { studio } = req.params;
  console.log(studio);
  res.send("hi");
}

export { allStudiosGet, singleStudioGet };
