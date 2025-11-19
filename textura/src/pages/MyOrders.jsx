import React, { useEffect, useState } from "react";
import "../styles/MyOrders.css";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch the user's orders
    fetch(`http://localhost:5000/api/orders/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error loading orders:", err));
  }, []);

  return (
    <section className="orders-page">
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076503.png"
            alt="No Orders"
          />
          <h3>No orders yet</h3>
          <button onClick={() => navigate("/boys")}>Shop Now</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <h4>Order ID: {order.orderId}</h4>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <p>{item.name}</p>
                    <span>x{item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <p>
                  Total: <strong>₹{order.total.toLocaleString("en-IN")}</strong>
                </p>
                <p className="date">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
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
