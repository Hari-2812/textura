import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

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

export default router;
