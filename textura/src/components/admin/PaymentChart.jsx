import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PaymentChart = () => {
  const data = [
    { name: "Successful", value: 85 },
    { name: "Pending", value: 10 },
    { name: "Failed", value: 5 },
  ];

  const COLORS = ["#06d6a0", "#ffd166", "#ef476f"];

  return (
    <div className="chart-container">
      <h3>Payment Success Rate</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={90}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PaymentChart;
