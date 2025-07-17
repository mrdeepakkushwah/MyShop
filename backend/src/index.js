// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes/authRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/order");

const dbConnect = require("./config/dbConnect");
const errorHandler = require("./middlewares/errorHandler");
const {
  authenticate,
  authorizeRoles,
} = require("./middlewares/authMiddleware");

// ✅ Validate critical environment variables
if (
  !process.env.JWT_SECRET ||
  !process.env.MONGODB_URI ||
  !process.env.CLIENT_URL
) {
  console.error("❌ Missing critical environment variables. Check .env file.");
  process.exit(1);
}

// ✅ Initialize app
const app = express();

// ✅ Connect to MongoDB
dbConnect();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ✅ Routes
app.use("/", routes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

// ✅ Admin-only test route (optional)
app.get("/admin/test", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "✅ Admin access granted.", user: req.user });
});

// ✅ Default welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MyShop API 🎉" });
});

// ✅ 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ✅ Global Error Handler Middleware
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
