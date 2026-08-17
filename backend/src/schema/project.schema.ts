import { Schema, model, Types } from "mongoose";

const projectSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Architecture",
      trim: true,
    },

    thumbnail: {
      type: String,
      default: null,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    technologies: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      default: null,
    },

    demoUrl: {
      type: String,
      default: null,
    },

    liveUrl: {
      type: String,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = model("Project", projectSchema);
