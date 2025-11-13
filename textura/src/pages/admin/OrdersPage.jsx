import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/orders`);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
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
                  <td>{o.orderId}</td>
                  <td>{o.customerName}</td>
                  <td>₹{o.total}</td>
                  <td>{o.paymentMethod || "COD"}</td>

                  <td
                    className={
                      o.status === "Delivered"
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {o.status}
                  </td>

                  <td>{new Date(o.createdAt).toLocaleString()}</td>

                  <td>
                    <button
                      className="btn primary"
                      onClick={() => navigate(`/admin/track-order/${o.orderId}`)}
                    >
                      Track Order
                    </button>
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
