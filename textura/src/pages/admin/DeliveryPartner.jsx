import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../api";
import axios from "axios";

const DeliveryPartner = () => {
  const [orders, setOrders] = useState([]);
  const backendUrl = BACKEND_URL;

  const fetchOrders = async () => {
    const token = localStorage.getItem("userToken");
    const res = await axios.get(`${backendUrl}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data.orders);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("userToken");
    await axios.patch(`${backendUrl}/api/admin/orders/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
