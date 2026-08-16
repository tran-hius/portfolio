import mongoose from "mongoose";
import { Logger } from "../utils/logger.util.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    Logger.info("MongoDB connected successfully");
  } catch (error) {
    Logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

