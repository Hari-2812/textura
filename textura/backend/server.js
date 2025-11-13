import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// -------------------------
// SOCKET.IO CONFIG
// -------------------------
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  transports: ["websocket", "polling"],
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach socket instance to Express app
app.set("io", io);

// Connect Database
connectDB();

// -------------------------
// ROUTES
// -------------------------
import orderRoutes from "./routes/orders.js";
import adminStatsRoutes from "../routes/adminStats.js";

// Order CRUD + status routes
app.use("/api/admin/orders", orderRoutes);

// Dashboard stats + graph routes
app.use("/api/admin", adminStatsRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// -------------------------
// SOCKET.IO CONNECTION LOGS
// -------------------------
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", socket.id, "Reason:", reason);
  });
});
