import { Router } from "express";
import * as moviesController from "../controllers/moviesController.js";

const moviesRouter = Router();

moviesRouter.get("/", moviesController.allMoviesGet);
moviesRouter.get("/add-movie", moviesController.addMovieGet);
moviesRouter.post("/add-movie", moviesController.addMoviePost);
moviesRouter.get("/:moviePath", moviesController.singleMovieGet);

export default moviesRouter;
