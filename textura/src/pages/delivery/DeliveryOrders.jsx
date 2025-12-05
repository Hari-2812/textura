import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryOrders = () => {
  const backendUrl = process.env.REACT_APP_API_URL || "https://textura-z80b.onrender.com";
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(`${backendUrl}/api/admin/orders`);
    setOrders(res.data.orders);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${backendUrl}/api/admin/orders/partner/update-status/${id}`, {
      status,
    });

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Delivery Partner Panel</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.orderId}</td>
              <td>{o.customerName}</td>
              <td>₹{o.total}</td>

              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Picked Up</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryOrders;
