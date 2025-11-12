// src/components/CategorySection.jsx
import React from "react";
import CategoryCard from "./CategoryCard";
import "../styles/CategorySection.css";
import boysImg from "../assets/images/boys-category.jpg";
import girlsImg from "../assets/images/girls-category.jpg";

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      image: boysImg,
      title: "Boys",
      description: "Trendy and comfortable outfits for boys aged 2–15 years.",
      link: "/boys",
    },
    {
      id: 2,
      image: girlsImg,
      title: "Girls",
      description: "Stylish and cozy outfits for girls aged 2–15 years.",
      link: "/girls",
    },
  ];

  return (
    <section className="category-section">
      <h2 className="category-title">Shop by Category</h2>
      <div className="category-container">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            image={cat.image}
            title={cat.title}
            description={cat.description}
            link={cat.link}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
