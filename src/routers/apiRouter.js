import express from "express";
import {
  createComment,
  deleteComment,
  registerVideo,
} from "../controllers/videoController";

const apiRouter = new express.Router();

apiRouter.post("/video/:id/view", registerVideo);
apiRouter.post("/video/:id/comment", createComment);
apiRouter.delete("/comment/:id/delete", deleteComment);

export default apiRouter;
