import { Schema, model, Types } from "mongoose";

export interface IExperience {
  userId: Types.ObjectId;
  company: string;
  position: string;
  location?: string | null | undefined;
  startDate: Date;
  endDate?: Date | null | undefined;
  isCurrent?: boolean | undefined;
  description?: string | null | undefined;
  technologies?: string[] | undefined;
  order?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

const experienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: null,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for user experiences ordered by date and priority
experienceSchema.index({ userId: 1, order: 1, startDate: -1 });

export const ExperienceModel = model<IExperience>(
  "Experience",
  experienceSchema,
);
