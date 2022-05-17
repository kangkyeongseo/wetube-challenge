import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userId: { type: String, require: true, unique: true, trim: true },
  email: { type: String, require: true, unique: true },
  password: { type: String },
  name: { type: String, require: true },
  socialOnly: false,
  avatarUrl: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 5);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
