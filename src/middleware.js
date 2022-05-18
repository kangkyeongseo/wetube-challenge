import multer from "multer";

export const sessionMiddeware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const publicMiddleware = (req, res, next) => {
  const {
    locals: { loggedIn },
  } = res;
  if (loggedIn) {
    return res.status(400).redirect("/");
  } else {
    return next();
  }
};

export const protectorMiddleware = (req, res, next) => {
  const {
    locals: { loggedIn },
  } = res;
  if (!loggedIn) {
    return res.status(400).redirect("/");
  } else {
    return next();
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
});

export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
});

export const thumbnailUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
});
