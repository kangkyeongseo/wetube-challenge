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
app.use("/uploads", express.static("uploads"));

app.use("/", rootRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

const handleListen = () => console.log(`Listening on http://localhost${PORT}`);
app.listen(PORT, handleListen);
