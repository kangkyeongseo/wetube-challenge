import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController";

import { getHome, getSearch } from "../controllers/videoController";
import { publicMiddleware } from "../middleware";

const rootRouter = new express.Router();

rootRouter.get("/", getHome);
rootRouter.get("/search", getSearch);
rootRouter.route("/login").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/join").all(publicMiddleware).get(getJoin).post(postJoin);

export default rootRouter;
