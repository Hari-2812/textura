import express from "express";
import mongoose from "mongoose";   // ✅ REQUIRED FIX
import Order from "../models/Order.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { orderCreateSchema, validate } from "../middleware/validate.js";

const router = express.Router();
const isRequestAdmin = (req) =>
  req.user?.isAdmin ||
  (process.env.ADMIN_EMAIL &&
    req.user?.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());

/* ============================================================
   📌 CREATE NEW ORDER
============================================================ */
router.post("/", protect, validate(orderCreateSchema), async (req, res) => {
  try {
    const io = req.app.get("io");

    const orderId = "TXR" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await Order.create({
      ...req.body,
      customerEmail: req.user.email,
      orderId,
    });

    io.emit("newOrder", {
      message: `🛒 New order received (Order ID: ${newOrder.orderId})`,
      order: newOrder,
    });

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

/* ============================================================
   📌 UPDATE ORDER STATUS
============================================================ */
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const io = req.app.get("io");

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    io.emit("orderUpdated", {
      message: `🔄 Order ${updatedOrder._id} status updated to "${updatedOrder.status}"`,
      order: updatedOrder,
    });

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Order Update Error:", err);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

/* ============================================================
   📌 GET ALL ORDERS (Admin)
============================================================ */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

/* ============================================================
   📌 GET ORDERS BY USER EMAIL
============================================================ */
router.get("/user/:email", protect, async (req, res) => {
  try {
    if (req.user.email !== req.params.email && !isRequestAdmin(req)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const orders = await Order.find({
      customerEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
});

/* ============================================================
   🔍 3️⃣ GET ORDER BY ID or orderId
============================================================ */
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    let order = null;

    // Check MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // If not found by _id, check orderId
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.customerEmail !== req.user.email && !isRequestAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching order",
      error: err.message,
    });
  }
});

export default router;
