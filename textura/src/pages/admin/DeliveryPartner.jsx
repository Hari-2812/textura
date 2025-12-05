import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryPartner = () => {
  const [orders, setOrders] = useState([]);
  const backendUrl = process.env.REACT_APP_API_URL || "https://textura-z80b.onrender.com";

  const fetchOrders = async () => {
    const res = await axios.get(`${backendUrl}/api/admin/orders`);
    setOrders(res.data.orders);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${backendUrl}/api/admin/orders/${id}`, { status });
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Delivery Partner Panel</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.orderId}</td>
              <td>{o.customerName}</td>
              <td>{o.address}</td>
              <td>{o.status}</td>
              <td>
                {o.status === "Pending" && (
                  <button onClick={() => updateStatus(o._id, "Accepted")}>Accept</button>
                )}
                {o.status === "Accepted" && (
                  <button onClick={() => updateStatus(o._id, "Picked Up")}>Picked Up</button>
                )}
                {o.status === "Picked Up" && (
                  <button onClick={() => updateStatus(o._id, "In Transit")}>In Transit</button>
                )}
                {o.status === "In Transit" && (
                  <button onClick={() => updateStatus(o._id, "Delivered")}>Delivered</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryPartner;
