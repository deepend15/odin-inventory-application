import { Router } from "express";
import * as studiosController from "../controllers/studiosController.js";

const studiosRouter = Router();

studiosRouter.get("/", studiosController.allStudiosGet);
studiosRouter.get("/:studioPath", studiosController.singleStudioGet);

export default studiosRouter;
