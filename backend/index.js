// Load environment variables
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes and middleware
import routes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import dbConnect from "./config/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authenticate, authorizeRoles } from "./middlewares/authMiddleware.js";

// Validate required environment variables
const REQUIRED_VARS = ["JWT_SECRET", "MONGODB_URI", "CLIENT_URL"];
const missingVars = REQUIRED_VARS.filter((v) => !process.env[v]);

if (missingVars.length) {
  console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Initialize app
const app = express();

// Connect to MongoDB
dbConnect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin:process.env.CLIENT_URL || '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// API Routes
app.use("/", routes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

// Admin protected test route
app.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "✅ Admin access granted.", user: req.user });
});

// API welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MyShop API 🎉" });
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server ready at: http://localhost:${PORT}`);
  console.log(
    `🔐 JWT Secret: ${process.env.JWT_SECRET ? "✔ Loaded" : "❌ Missing"}`
  );
  console.log(
    `🌐 MongoDB URI: ${process.env.MONGODB_URI ? "✔ Loaded" : "❌ Missing"}`
  );
  console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`);

});
