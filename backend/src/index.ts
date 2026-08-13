import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js";
import authRouter from "./routers/auth.routes.js"

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter)

const PORT = process.env.PORT || 8888;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
