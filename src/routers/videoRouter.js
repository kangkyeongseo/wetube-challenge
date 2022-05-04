import express from "express";
import {
  getUpload,
  getVideoDelete,
  getVideoEdit,
  getWatch,
} from "../controllers/videoController";

const videoRouter = new express.Router();

videoRouter.get("/upload", getUpload);
videoRouter.get("/:id", getWatch);
videoRouter.get("/:id/edit", getVideoEdit);
videoRouter.get("/:id/delete", getVideoDelete);

export default videoRouter;
