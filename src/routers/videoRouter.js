import express from "express";
import {
  getUpload,
  getVideoDelete,
  getVideoEdit,
  getWatch,
  postUpload,
  postVideoEdit,
} from "../controllers/videoController";

const videoRouter = new express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id", getWatch);
videoRouter.route("/:id/edit").get(getVideoEdit).post(postVideoEdit);
videoRouter.get("/:id/delete", getVideoDelete);

export default videoRouter;
