import React from "react";
import { products } from "../data/products";
import "../styles/BoysPage.css"; // ✅ create this CSS file

const BoysPage = () => {
  // Filter only boys' products
  const boysProducts = products.filter((p) => p.category === "boys");

  return (
    <section className="boys-page">
      <h2>Boys Collection (2–15 years)</h2>

      <div className="boys-container">
        {boysProducts.map((p) => (
          <div key={p.id} className="boys-card">
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BoysPage;
