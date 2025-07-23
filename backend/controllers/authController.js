import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

// Utility: safely pick user fields for response
const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  contact: user.contact,
  role: user.role,
  city: user.city,
  pincode: user.pincode,
  dob: user.dob,
  gender: user.gender,
});

// Generate access token only
const generateAccessToken = (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

// ---------- Signup ----------
export const signup = async (req, res) => {
  try {
    const { name, email, password, contact, city, pincode, dob, gender } =
      req.body;

    if (!name || !email || !password || !contact) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    if (!/^\d{10}$/.test(contact.toString())) {
      return res
        .status(400)
        .json({ message: "Enter a valid 10-digit contact number." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender value." });
    }

    if (dob && isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: "Invalid date of birth format." });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "Email" : "Contact";
      return res
        .status(409)
        .json({ message: `${conflictField} already registered.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      contact,
      city,
      pincode,
      dob,
      gender,
      role: "user",
    });

    const token = generateAccessToken(newUser);

    return res.status(201).json({
      message: "User Signup Successfully",
      token,
      user: getSafeUser(newUser),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ---------- Login ----------
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = generateAccessToken(existingUser);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: getSafeUser(existingUser),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ---------- Logout ----------
export const logoutUser = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

// ---------- Get User Data ----------
export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: getSafeUser(user) });
  } catch (error) {
    console.error("Get user data error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
};

// ---------- Update User Data ----------
export const updateUserData = async (req, res) => {
  try {
    const { name, email, password, contact, city, pincode, dob, gender } =
      req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || !email || !contact) {
      return res
        .status(400)
        .json({ message: "Name, email, and contact are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!/^\d{10}$/.test(contact.toString())) {
      return res
        .status(400)
        .json({ message: "Contact must be a 10-digit number." });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    user.email = email;
    user.contact = contact;

    if (city !== undefined) user.city = city;
    if (pincode !== undefined) user.pincode = pincode;
    if (dob !== undefined) user.dob = dob ? new Date(dob) : null;
    if (gender !== undefined) user.gender = gender;

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters." });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
