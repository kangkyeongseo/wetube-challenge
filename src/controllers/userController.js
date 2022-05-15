import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getLogin = (req, res) => res.render("root/login");
export const postLogin = async (req, res) => {
  const {
    body: { userId, password },
  } = req;

  const user = await User.findOne({ userId, socilaOnly: false });

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
    console.log(user);
    console.log(email);

    const emailObj = email.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    let githubUser = await User.findOne({ email: emailObj.email });

    if (!githubUser) {
      emailUser = await User.create({
        userId: user.login,
        email: emailObj.email,
        password: "",
        name: user.name,
        socialOnly: true,
      });
    }
    req.session.logedIn = true;
    req.session.user = githubUser;
    return res.redirect("/");
  } else {
    return res.status(400).redirect("/login");
  }
};
