import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import StatsCard from "../../components/admin/StatsCard";
import PaymentChart from "../../components/admin/PaymentChart";
import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";
import "../../styles/Admin.css";
import "../../styles/AdminDashboard.css"; // 👈 for toast + animation

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("🟢 Connected");

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /* ============================================================
     🔄 Fetch initial dashboard stats + graph
  ============================================================ */
  const fetchData = async () => {
    try {
      const [statsRes, graphRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`),
        axios.get(`${backendUrl}/api/admin/sales-graph`),
      ]);
      setStats(statsRes.data);
      setGraphData(graphRes.data);
    } catch (err) {
      console.error("❌ Error fetching admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl]);

  /* ============================================================
     🔔 Real-time socket notifications
  ============================================================ */
  useEffect(() => {
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.io server");
      setConnectionStatus("🟢 Connected");
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔴 Disconnected from Socket.io server:", reason);
      setConnectionStatus("🔴 Disconnected — attempting reconnect...");
    });

    socket.on("reconnect_attempt", () => {
      setConnectionStatus("🟡 Reconnecting...");
    });

    socket.on("reconnect", (attempt) => {
      console.log("🔁 Reconnected after", attempt, "attempts");
      setConnectionStatus("🟢 Reconnected");
    });

    // 🛒 Notify new orders
    socket.on("newOrder", (data) => {
      console.log("🛒 New order received:", data);
      setNotifications((prev) => [...prev, data.message]);

      // 🔊 Optional notification sound (place /public/notification.mp3)
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});

      // 🧹 Remove notification after 6s
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 6000);

      // 🔄 Refresh stats automatically
      fetchData();
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Socket.io disconnected cleanly");
    };
  }, [backendUrl]);

  /* ============================================================
     🕐 Loading State
  ============================================================ */
  if (loading) return <p className="loading-text">Loading Dashboard...</p>;

  /* ============================================================
     📊 Stats Cards
  ============================================================ */
  const statsArray = [
    { title: "Total Orders", value: stats.totalOrders, icon: <FaBox />, color: "#06d6a0" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: <FaRupeeSign />, color: "#118ab2" },
    { title: "Delivered Orders", value: stats.deliveredOrders, icon: <FaTruck />, color: "#073b4c" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: <FaClock />, color: "#ef476f" },
  ];

  /* ============================================================
     💅 Render Dashboard
  ============================================================ */
  return (
    <div className="admin-dashboard">
      {/* 🔌 Connection Status Banner */}
      <div
        className={`connection-status ${
          connectionStatus.includes("Disconnected") ? "error" : ""
        }`}
      >
        {connectionStatus}
      </div>

      {/* 🔔 Toast Notifications */}
      <div className="toast-container">
        {notifications.map((msg, i) => (
          <div key={i} className="toast">
            {msg}
          </div>
        ))}
      </div>

      <h2 className="dashboard-title">📊 Dashboard Overview</h2>

      <div className="stats-grid">
        {statsArray.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>

      <div className="charts-section">
        <h3>📈 Sales Analytics</h3>
        <PaymentChart data={graphData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
