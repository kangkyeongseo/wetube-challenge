import express from "express";
import {
  createComment,
  deleteComment,
  registerVideo,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middleware";

const apiRouter = new express.Router();

apiRouter.post("/video/:id/view", registerVideo);
apiRouter.all(protectorMiddleware).post("/video/:id/comment", createComment);
apiRouter.all(protectorMiddleware).delete("/comment/:id/delete", deleteComment);

export default apiRouter;
