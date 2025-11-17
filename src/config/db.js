import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect("mongodb://localhost:27017");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

export default connectDB;
