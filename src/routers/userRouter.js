import express from "express";
import {
  getChangePassword,
  getDetail,
  getLogout,
  getUserDelete,
  getUserEdit,
  postChangePassword,
  postUserDelete,
  postUserEdit,
} from "../controllers/userController";

const userRouter = new express.Router();

userRouter.route("/edit").get(getUserEdit).post(postUserEdit);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/logout", getLogout);
userRouter.route("/delete").get(getUserDelete).post(postUserDelete);
userRouter.get("/:id", getDetail);

export default userRouter;
