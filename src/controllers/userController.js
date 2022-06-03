import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

// Get Login
export const getLogin = (req, res) => {
  return res.render("root/login", { pageTitle: "LOGIN" });
};

// Posts Login
export const postLogin = async (req, res) => {
  const {
    body: { userId, password },
  } = req;

  const user = await User.findOne({ userId, socilaOnly: false });

  if (!user) {
    return res.status(400).render("root/login", {
      pageTitle: "LOGIN",
      errorMessage: "ID does not exist.",
    });
  }

  const loginOk = await bcrypt.compare(password, user.password);

  if (!loginOk) {
    return res.status(400).render("root/login", {
      pageTitle: "LOGIN",
      errorMessage: "Passwords do not match.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

// Get Join
export const getJoin = (req, res) => {
  return res.render("root/join", { pageTitle: "JOIN" });
};

// Post Join
export const postJoin = async (req, res) => {
  const {
    body: { userId, email, name, password, password2 },
  } = req;

  const idExists = await User.exists({ userId });
  const emailExists = await User.exists({ email });

  if (password !== password2) {
    return res.status(400).render("root/join", {
      pageTitle: "JOIN",
      errorMessage: "Passwords do not match.",
    });
  }

  if (idExists) {
    return res.status(400).render("root/join", {
      pageTitle: "JOIN",
      errorMessage: "This ID is already in use.",
    });
  }

  if (emailExists) {
    return res.status(400).render("root/join", {
      pageTitle: "JOIN",
      errorMessage: "This E-Mail is already in use.",
    });
  }

  await User.create({
    userId,
    email,
    name,
    password,
    socialOnly: false,
    avatarUrl: "",
  });

  return res.redirect("/login");
};

// Get User Detail
export const getDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
    },
  });
  console.log(user);
  return res.render("user/detail", { pageTitle: user.name, user });
};

// Get User Edit
export const getUserEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  if (_id) {
    const user = await User.findById(_id);
    return res.render("user/user-edit", { pageTitle: "EDIT", user });
  }
  return res.status(403).redirect("/");
};

// Post User Edit
export const postUserEdit = async (req, res) => {
  const {
    body: { userId, email, name },
    session: {
      user: { _id, avatarUrl },
    },
    file,
  } = req;

  const user = await User.findById(_id);
  const userIdExists = await User.exists({ userId });
  const emailExists = await User.exists({ email });

  if (userIdExists !== null && userIdExists._id.toString() !== _id) {
    return res.status(400).render("user/user-edit", {
      pageTitle: "EDIT",
      errorMessage: "This ID is already taken.",
      user,
    });
  }

  if (emailExists !== null && emailExists._id.toString() !== _id) {
    return res.status(400).render("user/user-edit", {
      pageTitle: "EDIT",
      errorMessage: "This E-Mail is already taken.",
      user,
    });
  }

  const updeateUser = await User.findByIdAndUpdate(
    _id,
    {
      userId,
      email,
      name,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );

  req.session.user = updeateUser;

  return res.redirect(`/user/${_id}`);
};

// Get Change Password
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password");
    return res.redirect("/");
  }
  return res.render("user/password-change", { pageTitle: "CHANGE-PASSWORD" });
};

// Post Change Password
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
      pageTitle: "CHANGE-PASSWORD",
      errorMessage: "Current Password do not match.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).render("user/password-change", {
      pageTitle: "CHANGE-PASSWORD",
      errorMessage: "Confirm Password do not match.",
    });
  }

  user.password = newPassword;

  await user.save();
  req.flash("success", "Password updated");
  return res.redirect(`/user/logout`);
};

// Get Logout
export const getLogout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  req.flash("info", "Bye");
  return res.redirect("/");
};

// Get User Delete
export const getUserDelete = (req, res) => {
  return res.render("user/user-delete", { pageTitle: "DELETE-USER" });
};

// Post User Delete
export const postUserDelete = async (req, res) => {
  const {
    session: { user },
    body: { password },
  } = req;

  const checkOk = await bcrypt.compare(password, user.password);

  if (!checkOk) {
    return res.status(400).render("user/user-delete", {
      pageTitle: "DELETE-USER",
      errorMessage: "Password do not match",
    });
  }

  await User.findByIdAndDelete(user._id);

  req.session.destroy();

  return res.redirect("/");
};

// Github Oauth
export const startGithubLogin = (req, res) => {
  const url = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENTID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${url}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const {
    query: { code },
  } = req;
  const url = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENTID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const parmas = new URLSearchParams(config);
  const finalUrl = `${url}?${parmas}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiRrl = "https://api.github.com";
    const user = await (
      await fetch(`${apiRrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const email = await (
      await fetch(`${apiRrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = email.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    let githubUser = await User.findOne({ email: emailObj.email });

    if (!githubUser) {
      githubUser = await User.create({
        userId: user.login,
        email: emailObj.email,
        password: "",
        name: user.name,
        socialOnly: true,
        avatarUrl: user.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = githubUser;
    return res.redirect("/");
  } else {
    return res.status(400).redirect("/login");
  }
};
