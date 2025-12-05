import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/admin-theme.css";

const TrackOrder = () => {
  const { id } = useParams(); // id = orderId (TXRxxxxx)
  const backendUrl = process.env.REACT_APP_API_URL || "https://textura-z80b.onrender.com";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/orders/${id}`);

      if (res.data && res.data.order) {
        setOrder(res.data.order);
      } else {
        console.error("❌ Order missing in response:", res.data);
      }
    } catch (error) {
      console.error("❌ Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!id) return;    // ⛔ prevents first 404 call
  fetchOrderDetails();
}, [id]);


  if (loading) return <p className="loading-text">Loading Order...</p>;
  if (!order) return <p className="loading-text">Order not found.</p>;

  return (
    <div className="app-container">
      <h2 className="page-title">📦 Track Order — {order.orderId}</h2>

      <div className="order-details-popup">
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>

        <h3>Status: {order.status}</h3>

        <h4>Items</h4>
        {order.items.map((item, index) => (
          <p key={index}>
            {item.name} — {item.quantity} × ₹{item.price}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
