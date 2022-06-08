import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  registerVideo,
  thumbComment,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middleware";

const apiRouter = new express.Router();

apiRouter.post("/video/:id/view", registerVideo);
apiRouter.all(protectorMiddleware).post("/video/:id/comment", createComment);
apiRouter.all(protectorMiddleware).post("/comment/:id/edit", editComment);
apiRouter.all(protectorMiddleware).delete("/comment/:id/delete", deleteComment);
apiRouter.all(protectorMiddleware).post("/comment/:id/thumb", thumbComment);

export default apiRouter;
