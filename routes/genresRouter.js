import { Router } from "express";
import * as genresController from "../controllers/genresController.js";

const genresRouter = Router();

genresRouter.get("/", genresController.allGenresGet);
genresRouter.get("/add-genre", genresController.addGenreGet);
genresRouter.post("/add-genre", genresController.addGenrePost);
genresRouter.get("/:genrePath/edit", genresController.editGenreGet);
genresRouter.post("/:genrePath/edit", genresController.editGenrePost);
genresRouter.get("/:genrePath", genresController.singleGenreGet);

export default genresRouter;
