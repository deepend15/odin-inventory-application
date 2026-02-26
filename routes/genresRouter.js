import { Router } from "express";
import * as genresController from "../controllers/genresController.js";

const genresRouter = Router();

genresRouter.get("/", genresController.allGenresGet);
genresRouter.get("/:genre", genresController.singleGenreGet);

export default genresRouter;
