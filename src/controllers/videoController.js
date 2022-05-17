import User from "../models/User";
import Video from "../models/Video";

export const getHome = async (req, res) => {
  const videos = await Video.find({});
  res.render("root/home", { videos });
};

export const getUpload = (req, res) => res.render("video/upload");
export const postUpload = async (req, res) => {
  const {
    session: { user },
    body: { title, description, hashtags },
    files: { video, thumb },
  } = req;

  const newVideo = await Video.create({
    fileUrl: video[0].path,
    thumbUrl: thumb[0].path,
    title,
    description,
    hashtags: Video.hashtagMaker(hashtags),
    owner: user._id,
  });

  const loggedUser = await User.findById(user._id);
  loggedUser.videos.push(newVideo._id);
  loggedUser.save();

  return res.redirect("/");
};
export const getWatch = async (req, res) => {
  const {
    params: { id },
  } = req;

  const video = await Video.findById(id);
  return res.render("video/watch", { video });
};
export const getVideoEdit = async (req, res) => {
  const {
    params: { id },
  } = req;

  const video = await Video.findById(id);

  return res.render("video/video-edit", { video });
};
export const postVideoEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
  } = req;

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.hashtagMaker(hashtags),
  });

  return res.redirect("/");
};
export const getVideoDelete = async (req, res) => {
  const {
    params: { id },
  } = req;

  await Video.findByIdAndDelete(id);

  return res.redirect("/");
};
