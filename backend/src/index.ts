import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/database.js";
const app = express();
const PORT = process.env.PORT || 8888

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`)
})

