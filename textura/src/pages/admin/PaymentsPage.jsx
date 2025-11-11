import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../styles/Admin.css";

const PaymentsPage = () => {
  const data = [
    { month: "Jan", revenue: 32000 },
    { month: "Feb", revenue: 45000 },
    { month: "Mar", revenue: 38000 },
    { month: "Apr", revenue: 52000 },
    { month: "May", revenue: 61000 },
  ];

  const transactions = [
    { id: "PAY-9981", amount: "₹1,299", status: "Success", method: "Razorpay" },
    { id: "PAY-9982", amount: "₹2,000", status: "Pending", method: "Card" },
    { id: "PAY-9983", amount: "₹799", status: "Failed", method: "UPI" },
  ];

  return (
    <div className="admin-page">
      <h2>💳 Payments</h2>
      <div className="chart-container">
        <h3>Revenue (Monthly)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#06d6a0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: "2rem" }}>Recent Transactions</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.amount}</td>
                <td
                  className={
                    t.status === "Success"
                      ? "text-success"
                      : t.status === "Pending"
                      ? "text-warning"
                      : "text-danger"
                  }
                >
                  {t.status}
                </td>
                <td>{t.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
