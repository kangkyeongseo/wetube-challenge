import express from "express";
import { createComment, registerVideo } from "../controllers/videoController";

const apiRouter = new express.Router();

apiRouter.post("/video/:id/view", registerVideo);
apiRouter.post("/video/:id/comment", createComment);

export default apiRouter;
