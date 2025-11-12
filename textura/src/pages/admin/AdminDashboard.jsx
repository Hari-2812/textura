import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import StatsCard from "../../components/admin/StatsCard";
import PaymentChart from "../../components/admin/PaymentChart";
import { FaBox, FaRupeeSign, FaTruck, FaClock } from "react-icons/fa";
import "../../styles/Admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${backendUrl}/api/admin/stats`);
        const graphRes = await axios.get(`${backendUrl}/api/admin/sales-graph`);
        setStats(statsRes.data);
        setGraphData(graphRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ Real-Time Order Notifications
    const socket = io(backendUrl);

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.io server");
    });

    socket.on("newOrder", (data) => {
      console.log("🔔 New order:", data);
      setNotification(data.message);

      // Optional: Play sound
      const audio = new Audio("/notification.mp3");
      audio.play();

      // Hide notification after few seconds
      setTimeout(() => setNotification(""), 5000);
    });

    return () => {
      socket.disconnect();
    };
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
      {/* 🔔 Notification Banner */}
      {notification && (
        <div className="notification-banner">
          {notification}
        </div>
      )}

      <h2>📊 Dashboard Overview</h2>

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
