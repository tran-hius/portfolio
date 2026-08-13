import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },

    lastName: {
      type: String,
      required: false,
    },

    birthDay: {
      type: Date,
      required: false,
    },

    nation: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    sex: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    language: {
      type: [String],
      required: false,
    },

    socialUrl: {
      type: [String],
      required: false,
    },

    role: {
      type: String,
      default: "admin",
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

export default User;
