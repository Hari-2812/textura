import React from "react";
import StatsCard from "../../components/admin/StatsCard";
import PaymentChart from "../../components/admin/PaymentChart";
import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Orders", value: 542, icon: <FaBox />, color: "#06d6a0" },
    { title: "Total Revenue", value: "₹9.8 L", icon: <FaRupeeSign />, color: "#118ab2" },
    { title: "Delivered Orders", value: 498, icon: <FaTruck />, color: "#073b4c" },
    { title: "Pending Orders", value: 44, icon: <FaClock />, color: "#ef476f" },
  ];

  return (
    <div className="admin-dashboard">
      <h2>Overview</h2>
      <div className="stats-grid">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      <div className="charts-section">
        <PaymentChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
