import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { sessionMiddeware } from "./middleware.js";
import apiRouter from "./routers/apiRouter.js";
import flash from "express-flash";

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGOOSE_URL }),
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger);
app.use(sessionMiddeware);
app.use(flash());

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use("/", rootRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
