import express from "express";
import { all } from "express/lib/application";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController";

import { getHome } from "../controllers/videoController";
import { publicMiddleware } from "../middleware";

const rootRouter = new express.Router();

rootRouter.get("/", getHome);
rootRouter.route("/login").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicMiddleware).get(getJoin).post(postJoin);

export default rootRouter;
