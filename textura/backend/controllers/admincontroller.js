import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalPayments = await Payment.countDocuments();

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalPayments,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err });
  }
};

export const getSalesGraph = async (req, res) => {
  try {
    const data = await Payment.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          totalSales: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales graph", error: err });
  }
};
