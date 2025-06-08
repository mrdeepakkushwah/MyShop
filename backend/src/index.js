// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const routes = require("./routes/authRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/order");

const dbConnect = require("./config/dbConnect");
const errorHandler = require("./middlewares/errorHandler");

// ✅ Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing from .env");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing from .env");
  process.exit(1);
}

if (!process.env.CLIENT_URL) {
  console.error("❌ CLIENT_URL is missing from .env");
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

// ✅ Default welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MyShop API 🎉" });
});

// ✅ 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found." });
});

// ✅ Global Error Handler Middleware
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
