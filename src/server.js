import express from "express";
import "./db.js";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const PORT = 4000;

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(logger);

app.use("/", rootRouter);
app.use("/video", videoRouter);
app.use("/user", userRouter);

const handleListen = () => console.log(`Listening on http://localhost${PORT}`);
app.listen(PORT, handleListen);
