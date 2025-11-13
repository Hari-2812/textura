import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Admin.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/orders`);

      // Support both: array OR {orders:[]}
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
                {/* <th>Email</th> */}
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  {/* 🔹 Order ID */}
                  <td>{o.orderId}</td>

                  {/* 🔹 Customer Name */}
                  <td>{o.customerName}</td>

                  {/* 🔹 Customer Email */}
                  {/* <td>{o.customerEmail}</td> */}

                  {/* 🔹 Total Amount */}
                  <td>₹{o.total}</td>

                  {/* 🔹 Payment Method */}
                  <td>{o.paymentMethod || "COD"}</td>

                  {/* 🔹 Order Status */}
                  <td
                    className={
                      o.status === "Delivered"
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {o.status}
                  </td>

                  {/* 🔹 Order Date */}
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
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
