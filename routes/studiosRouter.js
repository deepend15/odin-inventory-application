import { Router } from "express";
import * as studiosController from "../controllers/studiosController.js";

const studiosRouter = Router();

studiosRouter.get("/", studiosController.allStudiosGet);

export default studiosRouter;
