import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { basicSecurityHeaders, rateLimiter } from "./middleware/security.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminStatsRoutes from "./routes/adminStats.js";
import offerRoutes from "./routes/offerRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tryOnRoutes from "./routes/tryon.js";

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://textura-navy.vercel.app",
];

const allowedOrigins = [
  ...new Set(
    [
      ...defaultAllowedOrigins,
      ...(process.env.CLIENT_URLS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ].map((origin) => origin.replace(/\/+$/, ""))
  ),
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

app.set("io", io);

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(basicSecurityHeaders);
app.use(rateLimiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Textura backend is running.",
    allowedOrigins,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminStatsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/newsletter", subscriberRoutes);
app.use("/api/tryon", tryOnRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
