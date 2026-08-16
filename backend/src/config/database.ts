import mongoose from "mongoose";
import { Logger } from "../utils/logger.util.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";
    await mongoose.connect(mongoUri);
    Logger.info("MongoDB connected successfully");
  } catch (error) {
    Logger.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;

