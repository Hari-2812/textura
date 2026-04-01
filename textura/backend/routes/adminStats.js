import express from "express";
import Order from "../models/Order.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();
router.use(protect, adminOnly);

/* ============================================================
   📊 Dashboard Stats
============================================================ */
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Pending", "Accepted", "Picked Up", "In Transit"] },
    });

    return res.json({
      totalOrders,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
    });
  } catch (err) {
    console.error("❌ Stats Error:", err);
    return res.status(500).json({ error: "Stats fetch error" });
  }
});

/* ============================================================
   📈 Sales Graph Data
============================================================ */
router.get("/sales-graph", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const since = new Date(today);
    since.setDate(since.getDate() - 6);

    const agg = await Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const map = {};
    agg.forEach((r) => (map[r._id] = r.total));

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, total: map[key] || 0 });
    }

    return res.json(result);
  } catch (err) {
    console.error("❌ Graph Error:", err);
    return res.status(500).json({ error: "Graph fetch error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };
    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error("Admin order detail error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error("Admin order update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

router.put("/orders/partner/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error("Partner status update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

export default router;
