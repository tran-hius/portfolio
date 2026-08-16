import { Schema, model } from "mongoose";

export interface IVisitor {
  ip: string;
  userAgent?: string | null | undefined;
  path?: string | undefined;
  method?: string | undefined;
  referer?: string | null | undefined;
  visitedAt?: Date | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

const visitorSchema = new Schema<IVisitor>(
  {
    ip: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    path: {
      type: String,
      default: "/",
    },
    method: {
      type: String,
      default: "GET",
    },
    referer: {
      type: String,
      default: null,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for querying visits over time by IP
visitorSchema.index({ ip: 1, visitedAt: -1 });

export const VisitorModel = model<IVisitor>("Visitor", visitorSchema);

