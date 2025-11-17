import "./loadEnv.js"; 
import express from "express"; // optional if app.js already exports express()
import connectDB from "./config/db.js";
import app from "./app.js";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";

// ✅ Connect to MongoDB
connectDB();

// ✅ Define routes
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
