import express from "express";
import session from "express-session";
import "./db.js";
import "dotenv/config";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { sessionMiddeware } from "./middleware.js";
import apiRouter from "./routers/apiRouter.js";
import flash from "express-flash";

const app = express();
const PORT = 4000;

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

const handleListen = () => console.log(`Listening on http://localhost${PORT}`);
app.listen(PORT, handleListen);
