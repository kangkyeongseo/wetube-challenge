import express from "express";
import {
  finishGithubLogin,
  getChangePassword,
  getDetail,
  getLogout,
  getUserDelete,
  getUserEdit,
  postChangePassword,
  postUserDelete,
  postUserEdit,
  startGithubLogin,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicMiddleware,
} from "../middleware";

const userRouter = new express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getUserEdit)
  .post(avatarUpload.single("avatar"), postUserEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.all(protectorMiddleware).get("/logout", getLogout);
userRouter
  .route("/delete")
  .all(protectorMiddleware)
  .get(getUserDelete)
  .post(postUserDelete);
userRouter.get("/:id", getDetail);
userRouter.all(publicMiddleware).get("/github/login", startGithubLogin);
userRouter.all(publicMiddleware).get("/github/finish", finishGithubLogin);

export default userRouter;
