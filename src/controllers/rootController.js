import Video from "../models/Video";

export const getHome = async (req, res) => {
  const videos = await Video.find({});
  res.render("root/home", { videos });
};
export const getLogin = (req, res) => res.render("root/login");
export const getJoin = (req, res) => res.render("root/join");
