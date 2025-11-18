import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect("mongodb+srv://devsrinibas_db_user:Ge85sJZgjBBQQuwA@freecluster.ju5itlx.mongodb.net/?appName=FreeCluster");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

export default connectDB;
