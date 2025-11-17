// middleware/authMiddleware.js
export function isAuthenticated(req, res, next) {
  if (req.user || req.session.user) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
}
