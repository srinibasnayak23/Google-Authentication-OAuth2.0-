import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; 
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Google Authentication (start)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// 🔹 Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const user = req.user;

    // If user has not set username/password yet, render setup page using EJS
    if (!user.username || !user.password) {
      return res.render("setup", { userId: user._id, email: user.email });
    }

    // Otherwise redirect to success page
    res.redirect("/auth/success");
  }
);


// 🔹 Success / Failure
router.get("/success", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.session.user.id;
    const user = await User.findById(userId).lean(); // .lean() gives plain object

    if (!user) {
      return res.status(404).send("<h3>User not found</h3>");
    }

    console.log("User from DB:", user);
    res.render("success", { user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Server error");
  }
});


router.get("/failure", (req, res) => {
  res.status(400).json({ message: "Login failed" });
});

// 🔹 Logout
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).send(err);
//     req.session.destroy();
//     res.clearCookie("connect.sid");
//     res.json({ message: "Logged out successfully" });
//   });
// });
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});


// ✅ GET /auth/login → show login form
router.get("/login", (req, res) => {
  res.render("login"); // renders views/login.ejs
});

// ✅ POST /auth/login → verify credentials
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Password (plain):", password);

  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).send("<h3>User not found</h3><a href='/auth/login'>Try again</a>");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).send("<h3>Invalid credentials</h3><a href='/auth/login'>Try again</a>");
    }

    req.session.user = { id: user._id, email: user.email };
    res.redirect("/auth/success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});



// =====================================================
// POST /auth/setup → Set username + password after Google login
// =====================================================
router.post("/setup", async (req, res) => {
  const { userId, username, password, dob } = req.body;
  console.dir("Setup Data:", req.body);

  if (!userId || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash password before save
    //const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    //user.password = hashedPassword;
    user.password = password;
    user.dob = dob;
    await user.save();
    //console.dir("Updated user:", user);

    //res.status(200).json({ message: "Setup completed successfully", user });
    res.redirect("/auth/success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// =====================================================
// GET /auth/setup?userId=xxxx → Fetch user info for setup page
// =====================================================
router.get("/setup", async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.username && user.password) {
      return res.status(200).json({
        message: "User already setup",
        setupCompleted: true,
        user: {
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
    }

    res.status(200).json({
      message: "User exists, setup pending",
      setupCompleted: false,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
