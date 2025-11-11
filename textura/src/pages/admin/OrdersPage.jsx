import React, { useState, useEffect } from "react";
import "../../styles/Admin.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  // 🧠 Dummy data (replace with API/Firebase later)
  useEffect(() => {
    setOrders([
      {
        id: "ORD-1023",
        total: "₹1,299",
        paymentStatus: "Paid",
        deliveryStatus: "Delivered",
        date: "2025-11-10",
      },
      {
        id: "ORD-1024",
        total: "₹799",
        paymentStatus: "Paid",
        deliveryStatus: "Shipped",
        date: "2025-11-10",
      },
      {
        id: "ORD-1025",
        total: "₹2,050",
        paymentStatus: "Pending",
        deliveryStatus: "Processing",
        date: "2025-11-11",
      },
    ]);
  }, []);

  return (
    <div className="admin-page">
      <h2>📦 Orders</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.total}</td>
                <td
                  className={
                    o.paymentStatus === "Paid"
                      ? "text-success"
                      : o.paymentStatus === "Pending"
                      ? "text-warning"
                      : "text-danger"
                  }
                >
                  {o.paymentStatus}
                </td>
                <td>{o.deliveryStatus}</td>
                <td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
