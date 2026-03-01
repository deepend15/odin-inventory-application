import { Router } from "express";
import * as studiosController from "../controllers/studiosController.js";

const studiosRouter = Router();

studiosRouter.get("/", studiosController.allStudiosGet);
studiosRouter.get("/add-studio", studiosController.addStudioGet);
studiosRouter.post("/add-studio", studiosController.addStudioPost);
studiosRouter.get("/:studioPath/edit", studiosController.editStudioGet);
studiosRouter.post("/:studioPath/edit", studiosController.editStudioPost);
studiosRouter.get("/:studioPath", studiosController.singleStudioGet);

export default studiosRouter;
