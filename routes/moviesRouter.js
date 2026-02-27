import { Router } from "express";
import * as moviesController from "../controllers/moviesController.js";

const moviesRouter = Router();

moviesRouter.get("/", moviesController.allMoviesGet);
moviesRouter.get("/add-movie", moviesController.addMovieGet);
moviesRouter.post("/add-movie", moviesController.addMoviePost);
moviesRouter.get("/:moviePath/edit", moviesController.editMovieGet);
moviesRouter.post("/:moviePath/edit", moviesController.editMoviePost);
moviesRouter.get("/:moviePath", moviesController.singleMovieGet);

export default moviesRouter;
