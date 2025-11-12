import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   🧾 1️⃣  Create a New Order (Auto Generates a Custom orderId)
============================================================ */
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // Generate a short, unique, human-readable ID
    const shortId = "TXR" + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      ...orderData,
      orderId: shortId,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "✅ Order created successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: err.message,
    });
  }
});

/* ============================================================
   📋 2️⃣  Get All Orders (Admin Dashboard)
============================================================ */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: err.message,
    });
  }
});

/* ============================================================
   🔍 3️⃣  Track Order (By MongoDB _id OR Custom orderId)
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    // 🔹 Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // 🔹 If not found, try searching by custom orderId
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "⚠️ Order not found. Please verify your Order ID.",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Order fetched successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error tracking order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while tracking order",
      error: err.message,
    });
  }
});

/* ============================================================
   🟡 4️⃣  Update Order Status (Admin can update e.g., Shipped/Delivered)
============================================================ */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Status field is required",
      });
    }

    // 🔹 Try updating by both _id and orderId
    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      order = await Order.findOneAndUpdate({ orderId: id }, { status }, { new: true });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or invalid ID",
      });
    }

    res.status(200).json({
      success: true,
      message: `✅ Order status updated to '${status}'`,
      order,
    });
  } catch (err) {
    console.error("❌ Error updating order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating order",
      error: err.message,
    });
  }
});

/* ============================================================
   🗑️ 5️⃣  Delete an Order (Admin Only)
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deleted;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Order.findByIdAndDelete(id);
    } else {
      deleted = await Order.findOneAndDelete({ orderId: id });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ Order deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting order",
      error: err.message,
    });
  }
});

export default router;
