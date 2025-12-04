// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import "../styles/MyOrders.css";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(stored);
    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const url = `${backendUrl}/api/orders/user/${encodeURIComponent(
      user.email
    )}`;

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // If you later protect this route with JWT, add:
            // Authorization: `Bearer ${localStorage.getItem("userToken")}`
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Server responded ${res.status}: ${text || res.statusText}`
          );
        }

        const data = await res.json();

        // backend returns { success: true, orders: [...] }
        if (data && data.success) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        } else if (Array.isArray(data)) {
          // fallback if backend returned raw array
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  if (loading) {
    return (
      <section className="orders-page">
        <h2>📦 My Orders</h2>
        <p>Loading your orders…</p>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <h2>📦 My Orders</h2>

      {error && <div className="orders-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            alt="No Orders"
          />
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders. Start shopping now!</p>
          <button onClick={() => navigate("/boys")}>Shop Now</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order._id || order.orderId || Math.random()}
              className="order-card"
            >
              <div className="order-header">
                <h4>Order ID: {order.orderId || order._id}</h4>
                <span
                  className={`status ${(order.status || "Pending")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-items">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <p className="oi-name">{item.name}</p>
                      <div className="oi-meta">
                        <span className="oi-qty">x{item.quantity}</span>
                        <span className="oi-price">₹{item.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items listed for this order.</p>
                )}
              </div>

              <div className="order-footer">
                <p>
                  Total:{" "}
                  <strong>
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </strong>
                </p>
                <p className="date">
                  Ordered on:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })
                    : "—"}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrders;
