import React from "react";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="stats-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
