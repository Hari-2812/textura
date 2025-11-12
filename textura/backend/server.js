import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import ordersRoute from "./routes/orders.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // 👈 create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", ordersRoute);

app.get("/", (req, res) => res.send("Admin backend running ✅"));

// ✅ SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log("🟢 Admin connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Admin disconnected:", socket.id);
  });
});

// 🧠 Make io accessible inside routes
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
