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
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("🟢 Connected");
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
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ================= SOCKET.IO REALTIME ================= */
  useEffect(() => {
    const socket = io(backendUrl);

    socket.on("connect", () => setConnectionStatus("🟢 Connected"));

    socket.on("disconnect", () =>
      setConnectionStatus("🔴 Reconnecting...")
    );

    socket.on("newOrder", (data) => {
      setNotifications((prev) => [...prev, data.message]);
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: data.message },
      ]);
      loadDashboard();
    });

    socket.on("orderUpdated", (data) => {
      setNotifications((prev) => [...prev, data.message]);
      loadDashboard();
    });

    return () => socket.disconnect();
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

      {/* Status */}
      <div
        className={`connection-status ${
          connectionStatus.includes("Reconnecting") ? "error" : ""
        }`}
      >
        {connectionStatus}
      </div>

      {/* Persistent Alerts */}
      {alerts.length > 0 && (
        <div className="alert-box">
          {alerts.map((a) => (
            <div key={a.id} className="alert-item">
              <p>{a.message}</p>
              <button
                onClick={() =>
                  setAlerts(alerts.filter((x) => x.id !== a.id))
                }
              >
                Mark as Seen
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {notifications.map((msg, i) => (
          <div key={i} className="toast">
            {msg}
          </div>
        ))}
      </div>

      {/* Heading */}
      <h2>📊 Dashboard Overview</h2>

      {/* Stat Cards */}
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

      {/* Chart */}
      <div className="admin-card" style={{ marginTop: "35px" }}>
        <h3>📈 Sales Analytics</h3>
        <PaymentChart data={graphData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
