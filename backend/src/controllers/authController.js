const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET; // ✅ safer
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN; // access token expiry
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN; // refresh token expiry

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

// Generate access & refresh tokens
const generateTokens = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  return { accessToken, refreshToken };
};

// ---------- Signup ----------
const signup = async (req, res) => {
  try {
    const { name, email, password, contact, city, pincode, dob, gender, role } =
      req.body;

    // Validate required fields
    
    if (!name || !email || !password || !contact) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Validate contact number
    if (!/^\d{10}$/.test(contact.toString())) {
      return res
        .status(400)
        .json({ message: "Enter a valid 10-digit contact number." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    // Validate gender if provided
    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender value." });
    }

    // Check for unique email and contact
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      const conflictField = existingUser.email === email ? "Email" : "Contact";
      return res
        .status(409)
        .json({ message: `${conflictField} already registered.` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      contact,
      city,
      pincode,
      dob,
      gender,
    });

    // Generate tokens
    const tokens = generateTokens(newUser);

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response
    return res.status(201).json({
      message: "User Signup Successfully",
      token: tokens.accessToken,
      user: getSafeUser(newUser),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { signup };
// ---------- Login ----------
const loginUser = async (req, res) => {
  try {
    const { email, password,role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email and password or role are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const tokens = generateTokens(existingUser);

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      token: tokens.accessToken,
      user: getSafeUser(existingUser),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ---------- Refresh Access Token ----------
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      return res.status(200).json({ token: accessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------- Logout ----------
const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ---------- Get User Data ----------
const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: getSafeUser(user) });
  } catch (error) {
    console.error("Get user data error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user data", error });
  }
};

// ---------- Update User Data ----------
const updateUserData = async (req, res) => {
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

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check email uniqueness excluding current user
    const emailExists = await userModel.findOne({
      email,
      _id: { $ne: user._id },
    });
    if (emailExists) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Check contact uniqueness excluding current user
    const contactExists = await userModel.findOne({
      contact,
      _id: { $ne: user._id },
    });
    if (contactExists) {
      return res.status(409).json({ message: "Contact already in use." });
    }

    // Update fields
    user.name = name;
    user.email = email;
    user.contact = contact;
    user.city = city || user.city;
    user.pincode = pincode || user.pincode;
    user.dob = dob ? new Date(dob) : user.dob;
    user.gender = gender || user.gender;

    // Password update with hashing
    if (password) {
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
    console.error("Update error:", error.message);
    res
      .status(500)
      .json({
        message: "Server error while updating user",
        error: error.message,
      });
  }
};

module.exports = {
  signup,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserData,
  updateUserData,
};
