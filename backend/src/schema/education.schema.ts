import { Schema, model, Types } from "mongoose";

export interface IEducation {
  userId: Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null | undefined;
  startDate: Date;
  endDate?: Date | null | undefined;
  isCurrent?: boolean | undefined;
  grade?: string | null | undefined;
  description?: string | null | undefined;
  order?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

const educationSchema = new Schema<IEducation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
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
    grade: {
      type: String,
      default: null,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
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

// Compound index for user educations
educationSchema.index({ userId: 1, order: 1, startDate: -1 });

export const EducationModel = model<IEducation>("Education", educationSchema);
