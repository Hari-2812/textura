// 📁 src/components/admin/PaymentChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PaymentChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#555", marginTop: "20px" }}>
        No sales data yet 📉
      </p>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #444",
              color: "#fff",
            }}
          />
          <Legend />
          <Bar
            dataKey="sales"
            fill="#00b4d8"
            barSize={45}
            radius={[6, 6, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#90e0ef"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentChart;
