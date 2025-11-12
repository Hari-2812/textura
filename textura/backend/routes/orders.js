import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   🧾 1️⃣  Create a New Order (with real-time admin notification)
============================================================ */
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // ✅ Notify all connected admins in real time
    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", {
        message: "🛒 New order received!",
        order,
      });
      console.log("📢 Emitted newOrder event to admins");
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
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
   📋 2️⃣  Get All Orders
============================================================ */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });

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
   🔎 2️⃣.5️⃣  Track Orders by Email (Customer Side)
============================================================ */
router.get("/track/:email", async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.email }).sort({
      date: -1,
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this email",
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("❌ Error fetching orders by email:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while tracking orders by email",
      error: err.message,
    });
  }
});

/* ============================================================
   🔍 3️⃣  Track a Specific Order by ID
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
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
   ✅ 4️⃣  Update Order Status (Mark as Delivered, etc.)
============================================================ */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Error updating order status:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating order",
      error: err.message,
    });
  }
});

/* ============================================================
   🗑️ 5️⃣  Delete Order (Optional - For Admin Control)
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
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
