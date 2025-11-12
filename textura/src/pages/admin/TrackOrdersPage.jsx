import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../styles/TrackOrders.css";

const TrackOrdersPage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Initialize socket connection once
  useEffect(() => {
    const socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to tracking socket");
    });

    socket.on("orderStatusUpdated", (data) => {
      console.log("📦 Order status updated:", data);
      if (order && data.orderId === order._id) {
        setOrder((prev) => ({ ...prev, status: data.newStatus }));
      }
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Socket disconnected (tracking)");
    };
  }, [backendUrl, order]);

  const handleTrack = async () => {
    if (!search.trim()) return setError("Please enter Order ID or Email");
    setError("");
    setLoading(true);
    setOrder(null);

    try {
      let res;

      if (search.includes("@")) {
        res = await axios.get(`${backendUrl}/api/admin/orders/track/${search}`);
      } else {
        res = await axios.get(`${backendUrl}/api/admin/orders/${search}`);
      }

      const data = res.data;
      setOrder(data.order || (data.orders && data.orders[0]) || null);
      if (!data.order && (!data.orders || data.orders.length === 0)) {
        setError("No order found");
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("No order found or invalid ID");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (status) => {
    const steps = ["Pending", "Packed", "Shipped", "Delivered"];
    const index = steps.indexOf(status);
    return { steps, active: index };
  };

  return (
    <div className="track-page">
      <h2>📦 Track Your Order</h2>

      <div className="track-search">
        <input
          type="text"
          placeholder="Enter Order ID or Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleTrack} disabled={loading}>
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {order && (
        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order._id || order.orderId}</p>
          <p><strong>Customer:</strong> {order.customer || order.customerEmail}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <div className="timeline-container">
            {getProgress(order.status).steps.map((step, index) => (
              <div
                key={index}
                className={`timeline-step ${
                  index <= getProgress(order.status).active ? "active" : ""
                }`}
              >
                <div className="circle">{index + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="status-footer">
            <p>
              🕒 Current Status:{" "}
              <strong style={{ color: "#007bff" }}>{order.status}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrdersPage;
