import express from "express";

const app = express();
const PORT = 4000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost${PORT}`);
app.listen(PORT, handleListen);
