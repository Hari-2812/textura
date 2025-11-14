import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";

import "../../styles/AdminDashboard.css";
import "../../styles/admin-theme.css";
import "../../styles/Admin.css";

import PaymentChart from "../../components/admin/PaymentChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });

  const [graphData, setGraphData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("🟢 Connected");

  const backendUrl = "http://localhost:5000";

  /* ============================================================
     📌 Fetch Dashboard Stats + Graph
  ============================================================ */
  const loadDashboard = async () => {
    try {
      const [statsRes, graphRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`),
        axios.get(`${backendUrl}/api/admin/sales-graph`),
      ]);

      setStats(statsRes.data);
      setGraphData(graphRes.data);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ============================================================
     🔴 Socket.io for Real-Time Notifications
  ============================================================ */
  useEffect(() => {
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnectionStatus("🟢 Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("🔴 Disconnected - reconnecting...");
    });

    // 🛒 New Order
    socket.on("newOrder", (data) => {
      setNotifications((prev) => [...prev, data.message]);
      setAlerts((prev) => [
        ...prev,
        { id: data.order.orderId, message: data.message },
      ]);
      loadDashboard();
    });

    // 🔁 Order Updated
    socket.on("orderUpdated", (data) => {
      setNotifications((prev) => [...prev, data.message]);
      loadDashboard();
    });

    return () => socket.disconnect();
  }, []);

  if (loading)
    return <p className="loading-text admin-dashboard-page">Loading Dashboard…</p>;

  /* ============================================================
     📌 Stats Cards Data
  ============================================================ */
  const statsArray = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaBox />,
      className: "total",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <FaRupeeSign />,
      className: "revenue",
    },
    {
      title: "Orders Delivered",
      value: stats.deliveredOrders,
      icon: <FaTruck />,
      className: "delivered",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaClock />,
      className: "pending",
    },
  ];

  return (
    <div className="admin-dashboard-page">

      {/* 🟢 Connection Status */}
      <div
        className={`connection-status ${connectionStatus.includes("Disconnected") ? "error" : ""}`}
      >
        {connectionStatus}
      </div>

      {/* 🚨 Persistent Alerts */}
      {alerts.length > 0 && (
        <div className="alert-box">
          {alerts.map((a) => (
            <div key={a.id} className="alert-item">
              <p>{a.message}</p>
              <button onClick={() => setAlerts(alerts.filter((x) => x.id !== a.id))}>
                Mark as Seen
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔔 Auto Toast Notifications */}
      <div className="toast-container">
        {notifications.map((msg, i) => (
          <div key={i} className="toast">
            {msg}
          </div>
        ))}
      </div>

      {/* ================================ */}
      {/*           PAGE TITLE            */}
      {/* ================================ */}
      <h2>📊 Dashboard Overview</h2>

      {/* ================================ */}
      {/*            STAT CARDS           */}
      {/* ================================ */}
      <div className="stats-grid">
        {statsArray.map((item, index) => (
          <div className={`stat-card ${item.className}`} key={index}>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
            <div className="stat-icon">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* ================================ */}
      {/*           SALES CHART           */}
      {/* ================================ */}
      <div className="admin-card" style={{ marginTop: "35px" }}>
        <h3>📈 Sales Analytics</h3>
        <PaymentChart data={graphData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
