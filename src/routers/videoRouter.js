import express from "express";
import {
  getUpload,
  getVideoDelete,
  getVideoEdit,
  getWatch,
  postUpload,
  postVideoDelete,
  postVideoEdit,
} from "../controllers/videoController";
import { thumbnailUpload, videoUpload } from "../middleware";

const videoRouter = new express.Router();

videoRouter
  .route("/upload")
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
videoRouter.get("/:id", getWatch);
videoRouter
  .route("/:id/edit")
  .get(getVideoEdit)
  .post(thumbnailUpload.single("thumb"), postVideoEdit);
videoRouter.route("/:id/delete").get(getVideoDelete).post(postVideoDelete);

export default videoRouter;
