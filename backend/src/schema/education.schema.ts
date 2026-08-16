import { Schema, model, Types } from "mongoose";

export interface IEducation {
  userId: Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null | undefined;
  startDate: string | Date;
  endDate?: string | Date | null | undefined;
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
      type: Schema.Types.Mixed,
      required: true,
    },
    endDate: {
      type: Schema.Types.Mixed,
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

educationSchema.index({ userId: 1, order: 1, startDate: -1 });

export const EducationModel = model<IEducation>("Education", educationSchema);
