import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  hashtags: [{ type: String }],
  meta: {
    view: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  createdAt: { type: Date, required: true, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

videoSchema.static("hashtagMaker", (hashtags) => {
  return hashtags
    .split(",")
    .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
