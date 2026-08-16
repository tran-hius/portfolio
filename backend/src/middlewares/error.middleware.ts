import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error.js";
import mongoose from "mongoose";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // If it's our custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      errorCode: "INVALID_ID",
      message: `Invalid ID format: ${err.value}`,
    });
  }

  // Handle Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const errorDetails = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(422).json({
      success: false,
      statusCode: 422,
      errorCode: "VALIDATION_ERROR",
      message: "Database validation failed",
      details: errorDetails,
    });
  }

  // Log unhandled server errors
  console.error("Unhandled Error:", err);

  const isProduction = process.env.NODE_ENV === "production";

  return res.status(500).json({
    success: false,
    statusCode: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: isProduction
      ? "An unexpected internal server error occurred"
      : err.message || "An unexpected error occurred",
  });
};
