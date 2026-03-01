import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString, convertToPath } from "./urlEncoding.js";

async function allStudiosGet(req, res) {
  const studios = await db.getAllStudios();
  res.render("studios/allStudios", {
    title: "Studios",
    studios: studios,
  });
}

async function singleStudioGet(req, res) {
  const { studioPath } = req.params;
  const encodedPath = encodeString(studioPath);
  const { studio } = await db.getSingleStudio(encodedPath);
  const movies = await db.getStudioMovies(studio);
  res.render("studios/singleStudio", {
    title: studio,
    movies: movies,
    studioPath: encodedPath,
  });
}

async function addStudioGet(req, res) {
  res.render("studios/addStudio", {
    title: "Add Studio",
  });
}

const validateStudio = [
  body("studio").trim().notEmpty().withMessage("Studio cannot be empty."),
];

const addStudioPost = [
  validateStudio,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("studios/addStudio", {
        title: "Add Studio",
        errors: errors.array(),
      });
    }
    const { studio } = matchedData(req);
    const studioPath = convertToPath(studio);
    const dupe = await db.checkForDupeStudio(studioPath);
    if (dupe.length > 0) {
      return res.status(400).render("studios/addStudio", {
        title: "Add Studio",
        dupeType: "studio",
        dupePath: `/studios/${dupe[0].url_path}`,
        dupeName: dupe[0].studio,
      });
    }
    await db.addStudio(studio, studioPath);
    res.redirect("/studios");
  },
];

async function editStudioGet(req, res) {
  const { studioPath } = req.params;
  const encodedPath = encodeString(studioPath);
  const studio = await db.getSingleStudio(encodedPath);
  res.render("studios/editStudio", {
    title: "Edit Studio",
    studio: studio,
    studioInputValue: studio.studio,
  });
}

const editStudioPost = [
  validateStudio,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { studioPath } = req.params;
      const encodedPath = encodeString(studioPath);
      const originalStudio = await db.getSingleStudio(encodedPath);
      const submittedData = matchedData(req, { onlyValidData: false });
      return res.status(400).render("studios/editStudio", {
        title: "Edit Studio",
        studio: originalStudio,
        studioInputValue: submittedData.studio,
        errors: errors.array(),
      });
    }
    const originalStudioPath = req.params.studioPath;
    const originalStudioEncodedPath = encodeString(originalStudioPath);
    const originalStudio = await db.getSingleStudio(originalStudioEncodedPath);
    const { studio } = matchedData(req);
    const newStudioPath = convertToPath(studio);
    const dupe = await db.checkForDupeStudio(newStudioPath, originalStudio.id);
    if (dupe.length > 0) {
      return res.status(400).render("studios/editStudio", {
        title: "Edit Studio",
        studio: originalStudio,
        studioInputValue: studio,
        dupeType: "studio",
        dupePath: `/studios/${dupe[0].url_path}`,
        dupeName: dupe[0].studio,
      });
    }
    await db.updateStudio(originalStudio.id, studio, newStudioPath);
    res.redirect(`/studios/${newStudioPath}`);
  },
];

export {
  allStudiosGet,
  singleStudioGet,
  addStudioGet,
  addStudioPost,
  editStudioGet,
  editStudioPost,
};
