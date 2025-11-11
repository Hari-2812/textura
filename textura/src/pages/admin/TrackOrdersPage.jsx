import React, { useState } from "react";
import "../../styles/Admin.css";

const TrackOrdersPage = () => {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(null);

  const dummyTracking = {
    id: "ORD-1024",
    steps: ["Order Placed", "Packed", "Shipped", "Delivered"],
    currentStep: 2,
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      setTracking(dummyTracking);
    }
  };

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

      {tracking && (
        <div className="tracking-container">
          <h3>Tracking #{tracking.id}</h3>
          <div className="progress-bar">
            {tracking.steps.map((step, i) => (
              <div
                key={i}
                className={`progress-step ${
                  i <= tracking.currentStep ? "active" : ""
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
