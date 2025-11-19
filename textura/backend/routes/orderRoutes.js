import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   📌 CREATE NEW ORDER
============================================================ */
router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");

    // Generate unique order ID
    const orderId = "TXR" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await Order.create({
      ...req.body,
      orderId, // 👈 FIX HERE
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
    res.status(500).json({ message: "Failed to create order" });
  }
});

/* ============================================================
   📌 UPDATE ORDER STATUS
============================================================ */
router.put("/:id/status", async (req, res) => {
  try {
    const io = req.app.get("io");

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 Emit update event
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
    res.status(500).json({ message: "Failed to update order" });
  }
});

/* ============================================================
   📌 GET ALL ORDERS (Admin)
============================================================ */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ============================================================
   📌 GET ORDERS BY USER EMAIL
============================================================ */
router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const orders = await Order.find({ customerEmail: userEmail }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

export default router;
