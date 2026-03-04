import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { encodeString, convertToPath } from "./urlEncoding.js";
import { validatePassword } from "./passwordValidator.js";

async function allStudiosGet(req, res) {
  const studios = await db.getAllStudios();
  let includeMissing;
  const missingStudioMovies = await db.checkForMissingStudioMovies();
  if (missingStudioMovies.length > 0) includeMissing = true;
  res.render("studios/allStudios", {
    title: "Studios",
    studios: studios,
    includeMissing: includeMissing,
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
    title: "Add studio",
    studioValue: "",
  });
}

const validateStudio = [
  body("studio")
    .trim()
    .notEmpty()
    .withMessage("Studio cannot be empty.")
    .isLength({ max: 255 })
    .withMessage("Studio cannot be more than 255 characters.")
    .custom((value) => {
      return value.toLowerCase() !== "missing";
    })
    .withMessage(`Studio name cannot be set to "Missing."`),
];

const addStudioPost = [
  [...validatePassword, ...validateStudio],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("studios/addStudio", {
        title: "Add studio",
        studioValue: req.body.studio,
        errors: errors.array(),
      });
    }
    const { studio } = matchedData(req);
    const studioPath = convertToPath(studio);
    const dupe = await db.checkForDupeStudio(studioPath);
    if (dupe.length > 0) {
      return res.status(400).render("studios/addStudio", {
        title: "Add studio",
        studioValue: req.body.studio,
        dupeType: "studio",
        dupePath: `/studios/${dupe[0].url_path}`,
        dupeName: dupe[0].studio,
      });
    }
    await db.addStudio(studio, studioPath);
    res.redirect(`/studios/${studioPath}`);
  },
];

async function editStudioGet(req, res) {
  const { studioPath } = req.params;
  const encodedPath = encodeString(studioPath);
  const studio = await db.getSingleStudio(encodedPath);
  res.render("studios/editStudio", {
    title: "Edit studio",
    studio: studio,
    studioInputValue: studio.studio,
  });
}

const editStudioPost = [
  [...validatePassword, ...validateStudio],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { studioPath } = req.params;
      const encodedPath = encodeString(studioPath);
      const originalStudio = await db.getSingleStudio(encodedPath);
      const submittedData = req.body;
      return res.status(400).render("studios/editStudio", {
        title: "Edit studio",
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
        title: "Edit studio",
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

async function deleteStudioGet(req, res) {
  const { studioPath } = req.params;
  const encodedPath = encodeString(studioPath);
  const studio = await db.getSingleStudio(encodedPath);
  res.render("studios/deleteStudio", {
    title: "Delete studio",
    studio: studio,
  });
}

const deleteStudioPost = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    const { studioPath } = req.params;
    const encodedPath = encodeString(studioPath);
    const studio = await db.getSingleStudio(encodedPath);
    if (!errors.isEmpty()) {
      return res.status(400).render("studios/deleteStudio", {
        title: "Delete studio",
        studio: studio,
        errors: errors.array(),
      });
    }
  },
];

export {
  allStudiosGet,
  singleStudioGet,
  addStudioGet,
  addStudioPost,
  editStudioGet,
  editStudioPost,
  deleteStudioGet,
};
