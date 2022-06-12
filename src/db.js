import mongoose from "mongoose";

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.once("open", () => {
  console.log("db connect");
});
