import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ Protected route
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    message: "Authenticated ✅",
    user: req.user, // passport attaches user here
  });
});

export default router;
