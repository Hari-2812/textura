import React, { useState } from "react";
import { products } from "../data/products";
import "../styles/BoysPage.css";

const BoysPage = () => {
  const boysProducts = products.filter((p) => p.category === "boys");
  const [filteredProducts, setFilteredProducts] = useState(boysProducts);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");

  // 🔍 Filter logic
  const handleFilter = () => {
    let filtered = [...boysProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (price !== "all") {
      const [min, max] = price.split("-");
      filtered = filtered.filter(
        (p) =>
          parseInt(p.price.replace("₹", "")) >= parseInt(min) &&
          parseInt(p.price.replace("₹", "")) <= parseInt(max)
      );
    }

    if (style !== "all") {
      filtered = filtered.filter((p) =>
        p.style.toLowerCase().includes(style.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <section className="boys-page">
      <h2>Boys Collection</h2>

      {/* ✅ Filter Bar (Top, clean design) */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="0-500">Under ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="1000-2000">₹1000 - ₹2000</option>
          <option value="2000-5000">₹2000 - ₹5000</option>
        </select>

        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="all">All Styles</option>
          <option value="Solid">Solid</option>
          <option value="Striped">Striped</option>
          <option value="Printed">Printed</option>
        </select>

        <button onClick={handleFilter}>Apply</button>
      </div>

      {/* ✅ Product Grid */}
      <div className="boys-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="boys-card">
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button>Add to Cart</button>
            </div>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </section>
  );
};

export default BoysPage;
