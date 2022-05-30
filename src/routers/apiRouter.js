import express from "express";
import { registerVideo } from "../controllers/videoController";

const apiRouter = new express.Router();

apiRouter.post("/video/:id/view", registerVideo);

export default apiRouter;
