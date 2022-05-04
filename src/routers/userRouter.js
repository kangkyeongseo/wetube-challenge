import express from "express";
import {
  getDetail,
  getLogout,
  getUserEdit,
} from "../controllers/userController";

const userRouter = new express.Router();

userRouter.get("/:id", getDetail);
userRouter.get("/:id/edit", getUserEdit);
userRouter.get("/:id/logout", getLogout);

export default userRouter;
