import React, { useState } from "react";
import axios from "axios";
import "../../styles/Admin.css";

const TrackOrdersPage = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/admin/orders/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      console.error("Track error:", err);
      setError("Order not found or server error.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const trackingSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  return (
    <div className="admin-page">
      <h2>🚚 Track Order</h2>

      <form onSubmit={handleTrack} className="track-form">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button type="submit">Track</button>
      </form>

      {loading && <p>Loading order details...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && (
        <div className="tracking-container">
          <h3>Tracking #{order._id}</h3>
          <p>
            <strong>Customer:</strong> {order.customer}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.total}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>

          {/* Progress Bar */}
          <div className="progress-bar">
            {trackingSteps.map((step, i) => (
              <div
                key={i}
                className={`progress-step ${
                  i <= getProgressStep(order.status) ? "active" : ""
                }`}
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrdersPage;
