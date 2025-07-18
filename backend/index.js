// Load environment variables
import { config } from "dotenv";
config();
// console.log("JWT_SECRET:", process.env.JWT_SECRET);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Import routes and middleware
import routes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/order.js";
import dbConnect from "./config/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authenticate, authorizeRoles } from "./middlewares/authMiddleware.js";

// Validate env
if (
  !process.env.JWT_SECRET ||
  !process.env.MONGODB_URI ||
  !process.env.CLIENT_URL
) {
  console.error("❌ Missing critical environment variables. Check .env file.");
  process.exit(1);
}

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Connect DB
dbConnect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// ✅ Serve React static files — correct path
const frontendBuildPath = path.resolve(__dirname, "../Frontend/dist");
app.use(express.static(frontendBuildPath));

// API Routes
app.use("/auth", routes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// / ✅ React SPA fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath,"index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Admin test
app.get("/admin/test", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "✅ Admin access granted.", user: req.user });
});

// Welcome
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MyShop API 🎉" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
