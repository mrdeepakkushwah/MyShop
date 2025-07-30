// // Load environment variables
// import { config } from "dotenv";
// config();

// // Core modules
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import http from "http"; // For Socket.io (optional)
// import { Server } from "socket.io"; // For WebSocket support

// // Internal modules
// import dbConnect from "./config/dbConnect.js";
// import errorHandler from "./middlewares/errorHandler.js";
// import { authenticate, authorizeRoles } from "./middlewares/authMiddleware.js";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import productRoutes from "./routes/productsRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// // Check for required env variables
// const REQUIRED_VARS = ["JWT_SECRET", "MONGODB_URI", "CLIENT_URL"];
// const missingVars = REQUIRED_VARS.filter((key) => !process.env[key]);
// if (missingVars.length) {
//   console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
//   process.exit(1);
// }

// // Initialize app and database
// const app = express();
// dbConnect();

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// // API Routes
// app.use("/", authRoutes);
// app.use("/", productRoutes);
// app.use("/", orderRoutes);

// // Admin-only route example
// app.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
//   res.status(200).json({
//     message: "✅ Admin access granted.",
//     user: req.user,
//   });
// });

// // Default welcome route
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "🎉 Welcome to MyShop API" });
// });

// // Handle 404
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found." });
// });

// // Global error handler
// app.use(errorHandler);

// // Create HTTP server and attach Socket.io (optional)
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL || "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   },
// });

// // Optional WebSocket logic
// // app.set("io", io);
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? "✔️" : "❌"}`);
//   console.log(`🌐 MongoDB URI: ${process.env.MONGODB_URI ? "✔️" : "❌"}`);
//   console.log(`🌍 Client URL: ${process.env.CLIENT_URL}`);
// });


// server.js
// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

// Routes & DB
import routes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dbConnect from "./config/dbConnect.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authenticate, authorizeRoles } from "./middlewares/authMiddleware.js";

// Validate environment
const REQUIRED_VARS = ["JWT_SECRET", "MONGODB_URI", "CLIENT_URL"];
const missingVars = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missingVars.length) {
  console.error(`❌ Missing env vars: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Initialize app & server
const app = express();

// DB connect
dbConnect();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", routes);
app.use("/", productRoutes);
app.use("/", orderRoutes);

// Admin test route
app.get("/admin", authenticate, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "✅ Admin access granted.", user: req.user });
});

// Welcome
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to MyShop API 🎉" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global Error
app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server ready at: http://localhost:${PORT}`);
});
