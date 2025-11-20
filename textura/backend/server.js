// ---------------------------------------------
// 1️⃣ Load .env FIRST (very important)
// ---------------------------------------------
import dotenv from "dotenv";
dotenv.config(); // MUST BE AT THE VERY TOP

// ---------------------------------------------
// 2️⃣ Import modules
// ---------------------------------------------
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminStatsRoutes from "./routes/adminStats.js";
import offerRoutes from "./routes/offerRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js"; // ⭐ NEWSLETTER ROUTE
import orderRoutes from "./routes/orderRoutes.js";
import tryOnRoutes from "./routes/tryon.js";
// ---------------------------------------------
// 3️⃣ App + Server setup
// ---------------------------------------------
const app = express();
const server = http.createServer(app);

// ---------------------------------------------
// 4️⃣ Socket.io Setup
// ---------------------------------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  transports: ["websocket", "polling"],
});

// ⭐ Make io available to all routes
app.set("io", io);

// ---------------------------------------------
// 5️⃣ Connect MongoDB (AFTER dotenv)
// ---------------------------------------------
connectDB();

// ---------------------------------------------
// 6️⃣ Middleware
// ---------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------
// 7️⃣ Debug check: See if JWT loaded
// ---------------------------------------------
console.log("🔐 Loaded JWT_SECRET:", process.env.JWT_SECRET);

// ---------------------------------------------
// 8️⃣ API Routes
// ---------------------------------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);

app.use("/api/admin", adminStatsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/newsletter", subscriberRoutes);
app.use("/api/tryon", tryOnRoutes);

// Root route
app.get("/test-news", (req, res) => {
  res.send("NEWS ROUTE WORKING");
});

app.get("/", (req, res) => {
  res.send("API running...");
});

// ---------------------------------------------
// 9️⃣ Socket Listener
// ---------------------------------------------
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ---------------------------------------------
// 🔟 Start Server
// ---------------------------------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
