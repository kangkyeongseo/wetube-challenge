import Video from "../models/Video";

export const getUpload = (req, res) => res.render("video/upload");
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
  } = req;

  await Video.create({
    title,
    description,
    hashtags: Video.hashtagMaker(hashtags),
  });

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
