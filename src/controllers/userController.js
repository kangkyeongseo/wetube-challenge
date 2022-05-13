import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => res.render("root/login");
export const postLogin = async (req, res) => {
  const {
    body: { userId, password },
  } = req;

  const user = await User.findOne({ userId });

  if (!user) {
    return res
      .status(400)
      .render("root/login", { errorMessage: "ID does not exist." });
  }

  const loginOk = await bcrypt.compare(password, user.password);

  if (!loginOk) {
    return res
      .status(400)
      .render("root/login", { errorMessage: "Passwords do not match." });
  }

  req.session.logedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const getJoin = (req, res) => res.render("root/join");
export const postJoin = async (req, res) => {
  const {
    body: { userId, email, name, password, password2 },
  } = req;

  const idExists = await User.exists({ userId });
  const emailExists = await User.exists({ email });

  if (password !== password2) {
    return res
      .status(400)
      .render("root/join", { errorMessage: "Passwords do not match." });
  }

  if (idExists) {
    return res
      .status(400)
      .render("root/join", { errorMessage: "This ID is already in use." });
  }

  if (emailExists) {
    return res
      .status(400)
      .render("root/join", { errorMessage: "This E-Mail is already in use." });
  }

  await User.create({
    userId,
    email,
    name,
    password,
  });

  return res.redirect("/login");
};

export const getDetail = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;

  const user = await User.findById(_id);

  return res.render("user/detail", { user });
};
export const getUserEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  if (_id) {
    const user = await User.findById(_id);
    return res.render("user/user-edit", { user });
  }
  return res.status(403).redirect("/");
};
export const postUserEdit = async (req, res) => {
  const {
    body: { userId, email, name },
    session: {
      user: { _id },
    },
  } = req;

  const user = await User.findById(_id);
  const userIdExists = await User.exists({ userId });
  const emailExists = await User.exists({ email });

  if (userIdExists !== null && userIdExists._id.toString() !== _id) {
    return res.status(400).render("user/user-edit", {
      errorMessage: "This ID is already taken.",
      user,
    });
  }

  if (emailExists !== null && emailExists._id.toString() !== _id) {
    return res.status(400).render("user/user-edit", {
      errorMessage: "This E-Mail is already taken.",
      user,
    });
  }

  await User.findByIdAndUpdate(_id, {
    userId,
    email,
    name,
  });

  return res.redirect(`/user/${_id}`);
};
export const getChangePassword = (req, res) =>
  res.render("user/password-change");
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { currentPassword, newPassword, confirmPassword },
  } = req;

  const user = await User.findById(_id);
  const checkOk = await bcrypt.compare(currentPassword, user.password);

  if (!checkOk) {
    return res.status(400).render("user/password-change", {
      errorMessage: "Current Password do not match.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).render("user/password-change", {
      errorMessage: "Confirm Password do not match.",
    });
  }

  user.password = newPassword;

  await user.save();

  return res.redirect(`/user/${user._id}`);
};
export const getLogout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getUserDelete = (req, res) => {
  return res.render("user/user-delete");
};

export const postUserDelete = async (req, res) => {
  const {
    session: { user },
    body: { password },
  } = req;

  const checkOk = await bcrypt.compare(password, user.password);

  if (!checkOk) {
    return res
      .status(400)
      .render("user/user-delete", { errorMessage: "Password do not match" });
  }

  await User.findByIdAndDelete(user._id);

  req.session.destroy();

  return res.redirect("/");
};
