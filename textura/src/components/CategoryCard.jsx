// src/components/CategoryCard.jsx
import React from "react";
import "../styles/CategorySection.css";

const CategoryCard = ({ image, title, description, link }) => {
  return (
    <div className="category-card">
      <img src={image} alt={title} className="category-image" />
      <div className="category-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link}>
          <button className="buy-btn">Buy Now</button>
        </a>
      </div>
    </div>
  );
};

export default CategoryCard;
