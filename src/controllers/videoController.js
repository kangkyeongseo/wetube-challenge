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
    fileUrl: isHeroku ? video[0].lacation : video[0].path,
    thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
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
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    });
  if (!video) {
    req.flash("error", "Can not find video");
    return res.status(400).redirect("/");
  }

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
  if (!video) {
    req.flash("error", "Can not find video");
    return res.status(400).redirect("/");
  }
  if (String(user._id) !== String(video.owner._id)) {
    req.flash("error", "Can not access");
    return res.status(400).redirect("/");
  } else {
    return res.render("video/video-edit", {
      video,
      pageTitle: "EDIT",
    });
  }
};

// Post Edit Video
export const postVideoEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    file,
  } = req;
  const video = await Video.findById(id);
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.hashtagMaker(hashtags),
    thumbUrl: file ? (isHeroku ? file.location : file.path) : video.thumbUrl,
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

  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Can not find video");
    return res.status(400).redirect("/");
  }
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
  if (!checkOk) {
    return res.render("video/video-delete", {
      pageTitle: "DELETE",
      errorMessage: "passwords do not match.",
    });
  } else {
    await Video.findByIdAndDelete(id);
    req.flash("success", "Video delete successfully");
    return res.redirect("/");
  }
};

// Register View
export const registerVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(400);
  }
  video.meta.view = video.meta.view + 1;
  await video.save();
  return res.sendStatus(200);
};

// Create Comment
export const createComment = async (req, res) => {
  let data = [];

  const {
    body: { text },
    params: { id },
    session: {
      user: { _id, avatarUrl },
    },
  } = req;

  const video = await Video.findById(id);

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

  data.push({
    newCommentId: comment._id,
    commentNumber: video.comments.length,
    avatarUrl,
  });

  return res.status(201).json(data);
};

// Edit Comment
export const editComment = async (req, res) => {
  const {
    body: { text },
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video._id);

  if (!comment) {
    return res.sendStatus(404);
  }
  if (!video) {
    return res.sendStatus(404);
  }

  await Comment.findByIdAndUpdate(id, {
    text,
  });

  const index = video.comments.indexOf(id);
  video.comments[index].text = text;
  await video.save();

  return res.sendStatus(201);
};

// Delete Comment
export const deleteComment = async (req, res) => {
  const {
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  const video = await Video.findById(comment.video._id);

  if (!comment) {
    return res.sendStatus(404);
  }
  if (!video) {
    return res.sendStatus(404);
  }

  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await Comment.findByIdAndDelete(id);

  return res.status(200).json({ commentNumber: video.comments.length });
};

//thumb Comment
export const thumbComment = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;

  const comment = await Comment.findById(id);
  const user = await User.findById(_id);
  const video = await Video.findById(comment.video._id);

  if (!comment) {
    return res.sendStatus(404);
  }
  if (!video) {
    return res.sendStatus(404);
  }

  if (comment.thumbs.filter((id) => id === _id)[0] === undefined) {
    comment.thumbs.push(_id);
    await comment.save();

    return res.status(201).json({ count: comment.thumbs.length });
  } else {
    const commentIndex = comment.thumbs.indexOf(_id);
    comment.thumbs.splice(commentIndex, 1);
    await comment.save();

    return res.status(201).json({ count: comment.thumbs.length });
  }
};
