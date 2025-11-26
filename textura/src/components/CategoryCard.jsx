import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ image, title, description, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="category-card"
      onClick={() => navigate(link)}
      style={{ cursor: "pointer" }}
    >
      <img src={image} alt={title} className="category-image" />

      <div className="category-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <button className="buy-btn">Buy Now</button>
      </div>
    </div>
  );
};

export default CategoryCard;
