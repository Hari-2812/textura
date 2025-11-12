import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   📊 1️⃣ Admin Stats Endpoint
============================================================ */
router.get("/stats", async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;

    res.json({
      totalOrders,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   📈 2️⃣ Sales Graph (optional)
============================================================ */
router.get("/sales-graph", async (req, res) => {
  try {
    const orders = await Order.find();

    // Group orders by month for graph visualization
    const monthlySales = {};
    orders.forEach((order) => {
      const month = new Date(order.date || order.createdAt).toLocaleString("default", { month: "short" });
      monthlySales[month] = (monthlySales[month] || 0) + (order.totalAmount || order.total || 0);
    });

    const chartData = Object.keys(monthlySales).map((month) => ({
      name: month,
      sales: monthlySales[month],
    }));

    res.json(chartData);
  } catch (err) {
    console.error("Error generating sales graph:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
