import React from "react";
import boysImg from "../assets/images/boys-category.jpg";   // replace with your actual image path
import girlsImg from "../assets/images/girls-category.jpg"; // replace with your actual image path

const CategorySection = () => {
  return (
    <section className="category-section">
      <h2 className="category-title">Shop by Category</h2>

      <div className="category-container">
        {/* Boys Category */}
        <div className="category-card">
          <img src={boysImg} alt="Boys Fashion" className="category-image" />
          <div className="category-info">
            <h3>Boys</h3>
            <p>Trendy and comfortable outfits for boys aged 2–15 years.</p>
            <a href="/boys">
              <button className="buy-btn">Buy Now</button>
            </a>
          </div>
        </div>

        {/* Girls Category */}
        <div className="category-card">
          <img src={girlsImg} alt="Girls Fashion" className="category-image" />
          <div className="category-info">
            <h3>Girls</h3>
            <p>Stylish and cozy outfits for girls aged 2–15 years.</p>
            <a href="/girls">
              <button className="buy-btn">Buy Now</button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
