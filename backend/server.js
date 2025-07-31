// Load environment variables
const { config }  = require("dotenv");
config();

// Core modules
const express  = require("express");
const cors  =  require("cors");
const cookieParser = require("cookie-parser");


// Internal modules
const dbConnect = require("./config/dbConnect.js");
const errorHandler  = require("./middlewares/errorHandler.js");
const { authenticate, authorizeRoles }  = require("./middlewares/authMiddleware.js");

// Routes
const authRoutes  = require("./routes/authRoutes.js");
const productRoutes = require("./routes/productsRoutes.js");
const orderRoutes  = require("./routes/orderRoutes.js");

// Check for required env variables
const REQUIRED_VARS = ["JWT_SECRET", "MONGODB_URI", "CLIENT_URL"];
const missingVars = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missingVars.length) {
  console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Initialize app and database
const app = express();
dbConnect();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// API Routes
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

// Admin-only route example
app.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    message: "✅ Admin access granted.",
    user: req.user,
  });
});

// Default welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🎉 Welcome to MyShop API" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? "✔️" : "❌"}`);
  console.log(`🌐 MongoDB URI: ${process.env.MONGODB_URI ? "✔️" : "❌"}`);
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`);
});
