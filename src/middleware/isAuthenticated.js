export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: "Unauthorized. Please login first."
  });
};


// import jwt from "jsonwebtoken";

// export const isAuthenticated = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attach user info
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
