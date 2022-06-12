import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "wetube-clone-challenge-project/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: " wetube-clone-challenge-project/videos",
  acl: "public-read",
});

const s3ThumbnailUploader = multerS3({
  s3: s3,
  bucket: " wetube-clone-challenge-project/thumbnail",
  acl: "public-read",
});

export const sessionMiddeware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.homeTitle = "WETUBE";
  res.locals.isHeroku = isHeroku;
  next();
};

export const publicMiddleware = (req, res, next) => {
  const {
    locals: { loggedIn },
  } = res;
  if (loggedIn) {
    req.flash("error", "Allow only non-logged-in users");
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
    req.flash("error", "Allow only logged-in users");
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
  storage: isHeroku ? s3ImageUploader : undefined,
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fieldSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

export const thumbnailUpload = multer({
  dest: "uploads/thumbnail",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ThumbnailUploader : undefined,
});
