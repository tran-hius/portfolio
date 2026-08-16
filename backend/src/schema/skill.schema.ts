import { Schema, model, Types } from "mongoose";

export interface ISkill {
  userId: Types.ObjectId;
  name: string;
  category: string;
  proficiency?: number | null | undefined;
  icon?: string | null | undefined;
  order?: number | undefined;
  isFeatured?: boolean | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

const skillSchema = new Schema<ISkill>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
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

skillSchema.index({ category: 1, order: 1, createdAt: -1 });

export const SkillModel = model<ISkill>("Skill", skillSchema);
