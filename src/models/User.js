// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  username: { type: String, unique: true, sparse: true }, // optional unique username
  password: { type: String }, 
  dob: { type: Date }, // date of birth
});

// Hash password only if modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model("User", userSchema);