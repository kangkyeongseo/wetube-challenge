import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube-challenge");

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.once("open", () => {
  console.log("db connect");
});
