import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  birthDay: Date,
  nation: String,
  email: String,
  phoneNumber: String,
  sex: String,
  address: String,
  language: [String],
  socialUrl: [String],
});

const User = mongoose.model("User", UserSchema);

export default User;
