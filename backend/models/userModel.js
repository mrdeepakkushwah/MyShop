import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    city: String,
    pincode: String,
    dob: String,
    gender: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;

