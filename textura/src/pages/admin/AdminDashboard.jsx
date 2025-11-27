import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";
import "../../styles/AdminDashboard.css";
import "../../styles/admin-theme.css";
import "../../styles/Admin.css";

import PaymentChart from "../../components/admin/PaymentChart";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });

  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = "http://localhost:5000";

  const loadDashboard = async () => {
    try {
      const [statsRes, graphRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`),
        axios.get(`${backendUrl}/api/admin/sales-graph`),
      ]);

      setStats(statsRes.data);
      setGraphData(graphRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statsArray = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaBox />,
      className: "total",
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <FaRupeeSign />,
      className: "revenue",
      onClick: () => navigate("/admin/revenue"),
    },
    {
      title: "Orders Delivered",
      value: stats.deliveredOrders,
      icon: <FaTruck />,
      className: "delivered",
      onClick: () => navigate("/admin/delivery"),
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock />,
      className: "pending",
      onClick: () => navigate("/admin/orders"),
    },
  ];

  return (
    <div className="admin-dashboard-page">

      <h2>📊 Dashboard Overview</h2>

      <div className="stats-grid">
        {statsArray.map((item, i) => (
          <div
            key={i}
            className={`stat-card ${item.className}`}
            onClick={item.onClick}
          >
            <h3>{item.title}</h3>
            <p>{item.value}</p>
            <div className="stat-icon">{item.icon}</div>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: "35px" }}>
        <h3>📈 Sales Analytics</h3>
        <PaymentChart data={graphData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
