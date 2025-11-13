import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import StatsCard from "../../components/admin/StatsCard";
import PaymentChart from "../../components/admin/PaymentChart";
import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";
import "../../styles/Admin.css";
import "../../styles/AdminDashboard.css";

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

  const fetchData = async () => {
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
    fetchData();
  }, [backendUrl]);

  useEffect(() => {
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected");
      setConnectionStatus("🟢 Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("🔴 Disconnected - reconnecting...");
    });

    socket.on("newOrder", (data) => {
      console.log("🛒 New order:", data);
      setNotifications((prev) => [...prev, data.message]);
      fetchData();
    });

    socket.on("orderUpdated", (data) => {
      console.log("🔁 Order updated:", data);
      setNotifications((prev) => [...prev, data.message]);
      fetchData();
    });

    return () => socket.disconnect();
  }, []);

  if (loading) return <p className="loading-text">Loading Dashboard...</p>;

  const statsArray = [
    { title: "Total Orders", value: stats.totalOrders, icon: <FaBox />, color: "#06d6a0" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: <FaRupeeSign />, color: "#118ab2" },
    { title: "Delivered Orders", value: stats.deliveredOrders, icon: <FaTruck />, color: "#073b4c" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: <FaClock />, color: "#ef476f" },
  ];

  return (
    <div className="admin-dashboard">
      <div className={`connection-status ${
        connectionStatus.includes("Disconnected") ? "error" : ""
      }`}>
        {connectionStatus}
      </div>

      <div className="toast-container">
        {notifications.map((msg, i) => (
          <div key={i} className="toast">{msg}</div>
        ))}
      </div>

      <h2 className="dashboard-title">📊 Dashboard Overview</h2>

      <div className="stats-grid">
        {statsArray.map((s) => (
          <StatsCard key={s.title} {...s} />
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
