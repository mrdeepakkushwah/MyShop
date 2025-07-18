// Load environment variables
import { config } from "dotenv";
config();
console.log("JWT_SECRET:",process.env.JWT_SECRET);

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

// ✅ Validate critical environment variables
if (
  !process.env.JWT_SECRET ||
  !process.env.MONGODB_URI ||
  !process.env.CLIENT_URL
) {
  console.error("❌ Missing critical environment variables. Check .env file.");
  process.exit(1);
}

// ✅ Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Serve static files (React build)
app.use(express.static(path.join(__dirname, "Frontend", "dist")));

// ✅ SPA fallback route (after static files)
app.get("*", (_, res) => {
  res.sendFile(
    path.join(__dirname, "Frontend", "dist", "index.html"),
    (err) => {
      if (err) {
        console.error("Error sending index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    }
  );
});

// ✅ API Routes
app.use("/auth", routes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// ✅ Admin test route
app.get("/admin/test", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "✅ Admin access granted.", user: req.user });
});

// ✅ Welcome route
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
