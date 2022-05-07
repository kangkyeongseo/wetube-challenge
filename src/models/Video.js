import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  hashtags: [{ type: String }],
  meta: {
    view: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

videoSchema.static("hashtagMaker", (hashtags) => {
  return hashtags
    .split(",")
    .map((hashtag) => (hashtag.startsWith("#") ? hashtag : `#${hashtag}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
