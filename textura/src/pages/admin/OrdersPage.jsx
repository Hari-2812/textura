import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Admin.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/orders`);
      // supports both formats (array or {orders: []})
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.orders || [];
      setOrders(data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update order status
  const handleMarkDelivered = async (id) => {
    try {
      const res = await axios.patch(`${backendUrl}/api/admin/orders/${id}`, {
        status: "Delivered",
      });

      if (res.data.success) {
        alert("✅ Order marked as Delivered!");
        // Update locally for better UX
        setOrders((prev) =>
          prev.map((o) =>
            o._id === id ? { ...o, status: "Delivered" } : o
          )
        );
      } else {
        alert("❌ Failed to update order.");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("⚠️ Could not connect to backend.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading Orders...</p>;

  return (
    <div className="admin-page">
      <h2>📦 Orders</h2>

      <div className="admin-table-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.customer}</td>
                  <td>₹{o.total || o.totalAmount}</td>
                  <td>{o.paymentMethod === "upi" ? "UPI" : "COD"}</td>
                  <td
                    className={
                      o.status === "Delivered"
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {o.status}
                  </td>
                  <td>{new Date(o.createdAt || o.date).toLocaleString()}</td>
                  <td>
                    {o.status !== "Delivered" ? (
                      <button
                        className="mark-btn"
                        onClick={() => handleMarkDelivered(o._id)}
                      >
                        Mark as Delivered
                      </button>
                    ) : (
                      <span className="delivered-label">✅ Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
