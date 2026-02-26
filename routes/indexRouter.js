import { Router } from "express";
import * as moviesController from "../controllers/moviesController.js";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", {
    title: "Movie inventory",
  });
});
indexRouter.get("/movies", moviesController.allMoviesGet);
indexRouter.get("/movies/:moviePath", moviesController.singleMovieGet);

export default indexRouter;
