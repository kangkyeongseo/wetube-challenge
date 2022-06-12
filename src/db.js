import mongoose from "mongoose";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import "dotenv/config";
import "regenerator-runtime";

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.once("open", () => {
  console.log("db connect");
});
