import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // set frontend URL if needed
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
  transports: ["websocket", "polling"],
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.set("io", io);

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
import orderRoutes from "./routes/orders.js";
app.use("/api/admin/orders", orderRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// ✅ Start Server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Socket Events
io.on("connection", (socket) => {
  console.log("🟢 Admin connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Admin disconnected:", socket.id, "Reason:", reason);
  });
});
