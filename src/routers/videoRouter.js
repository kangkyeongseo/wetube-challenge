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
import {
  protectorMiddleware,
  thumbnailUpload,
  videoUpload,
} from "../middleware";

const videoRouter = new express.Router();

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
videoRouter.get("/:id", getWatch);
videoRouter
  .route("/:id/edit")
  .all(protectorMiddleware)
  .get(getVideoEdit)
  .post(thumbnailUpload.single("thumb"), postVideoEdit);
videoRouter
  .route("/:id/delete")
  .all(protectorMiddleware)
  .get(getVideoDelete)
  .post(postVideoDelete);

export default videoRouter;
