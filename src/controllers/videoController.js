import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import bcrypt from "bcrypt";
import { async } from "regenerator-runtime";

// Main Page
export const getHome = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  console.log(res.locals.loggedIn);
  return res.render("root/home", { videos, pageTitle: "HOME" });
};

// Search

export const getSearch = async (req, res) => {
  const {
    query: { search },
  } = req;
  const videos = await Video.find({
    title: search,
  }).populate("owner");
  return res.render("root/search", { videos, pageTitle: "SERACH" });
};

// Get Upload Video
export const getUpload = (req, res) => {
  if (req.session.loggedIn) {
    return res.render("video/upload");
  } else {
    return res.status(400).redirect("/");
  }
};

// Post Upload Video
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
  req.flash("success", "Video uploaded successfully");
  return res.redirect("/");
};

// Video Detail
export const getWatch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("owner").populate("comments");
  return res.render("video/watch", {
    video,
    pageTitle: video.title,
  });
};

// Get Edit Video
export const getVideoEdit = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const video = await Video.findById(id).populate("owner");
  if (String(user._id) === String(video.owner._id)) {
    return res.render("video/video-edit", {
      video,
      pageTitle: "EDIT",
    });
  } else {
    return res.redirect("/");
  }
};

// Post Edit Video
export const postVideoEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    file,
  } = req;
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.hashtagMaker(hashtags),
    thumbUrl: file.path,
  });
  req.flash("success", "Video edit successfully");
  return res.redirect("/");
};

// Get Delete Video
export const getVideoDelete = async (req, res) => {
  const {
    session: { user },
    params: { id },
  } = req;
  if (!user.socialOnly) {
    return res.render("video/video-delete", { pageTitle: "DELETE" });
  } else {
    await Video.findByIdAndDelete(id);
    req.flash("success", "Video delete successfully");
    return res.redirect("/");
  }
};

// Post Delete Video
export const postVideoDelete = async (req, res) => {
  const {
    params: { id },
    body: { password },
  } = req;
  const video = await Video.findById(id).populate("owner");
  const checkOk = await bcrypt.compare(password, video.owner.password);
  if (checkOk) {
    await Video.findByIdAndDelete(id);
    req.flash("success", "Video delete successfully");
    return res.redirect("/");
  } else {
    return res.render("video/video-delete", {
      pageTitle: "DELETE",
      errorMessage: "passwords do not match.",
    });
  }
};

// Register View
export const registerVideo = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.view = video.meta.view + 1;
  await video.save();
  return res.sendStatus(200);
};

// Create Comment
export const createComment = async (req, res) => {
  const {
    body: { text },
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    video: id,
    owner: _id,
  });

  video.comments.push(comment._id);
  await video.save();

  return res.sendStatus(201).json({ newCommentId: comment._id });
};

// Delete Comment
export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video._id);
  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
