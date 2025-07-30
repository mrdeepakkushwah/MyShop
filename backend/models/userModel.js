const { Schema, model }  = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    city: { type: String},
    pincode: {type:String},
    dob: {type:String},
    gender: { type:String},
    role:{ type: String, default: "user" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports =  User;

