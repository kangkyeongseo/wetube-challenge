export const sessionMiddeware = (req, res, next) => {
  res.locals.logedIn = Boolean(req.session.logedIn);
  res.locals.logedInUser = req.session.user || {};
  next();
};
