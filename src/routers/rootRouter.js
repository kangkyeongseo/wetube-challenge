import express from "express";
import { getHome, getJoin, getLogin } from "../controllers/rootController";

const rootRouter = new express.Router();

rootRouter.get("/", getHome);
rootRouter.get("/login", getLogin);
rootRouter.get("/join", getJoin);

export default rootRouter;
