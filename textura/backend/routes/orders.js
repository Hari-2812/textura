import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   🧾 1️⃣ Create New Order
============================================================ */
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    const shortId = "TXR" + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      ...orderData,
      orderId: shortId,
    });

    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", {
        message: `🛒 New Order Placed — ${order.orderId}`,
        order,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error creating order",
      error: err.message,
    });
  }
});

/* ============================================================
   📋 2️⃣ Get All Orders
============================================================ */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching orders",
      error: err.message,
    });
  }
});

/* ============================================================
   🔍 3️⃣ Get Order by ID or orderId
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let order = null;

    // If it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // If not found, check orderId
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
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

/* ============================================================
   🟡 4️⃣ Update Order Status
============================================================ */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    let order;

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      order = await Order.findOneAndUpdate({ orderId: id }, { status }, { new: true });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("orderUpdated", {
        message: `🚚 Order ${order.orderId} updated to ${order.status}`,
        order,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order updated to ${status}`,
      order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error updating order",
      error: err.message,
    });
  }
});

export default router;
