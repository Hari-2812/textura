import React, { useState, useEffect } from "react";
import { products } from "../data/products";
import "../styles/BoysPage.css";
import { useCart } from "../context/CartContext";

const BoysPage = ({ showFilters, setShowFilters }) => {
  const boysProducts = products.filter((p) => p.category === "boys");
  const [filteredProducts, setFilteredProducts] = useState(boysProducts);

  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");

  const { addToCart } = useCart();
  const [popup, setPopup] = useState(false);

  // ✅ Filter Logic
  const handleFilter = () => {
    let filtered = [...boysProducts];

    if (price !== "all") {
      const [min, max] = price.split("-");
      filtered = filtered.filter((p) => {
        const pr = parseInt(p.price.replace(/[₹,]/g, ""));
        return pr >= parseInt(min) && pr <= parseInt(max);
      });
    }

    if (style !== "all") {
      filtered = filtered.filter((p) =>
        p.style?.toLowerCase().includes(style.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setShowFilters(false);
  };

  // ✅ Reset when no filters active
  useEffect(() => {
    if (!showFilters && filteredProducts.length === 0) {
      setFilteredProducts(boysProducts);
    }
  }, [showFilters]);

  // ✅ Popup animation handler
  const showCartPopup = () => {
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
  };

  return (
    <section className="boys-page">
      <h2>Boys Collection</h2>

      {/* ✅ Filter Popup */}
      {showFilters && (
        <div className="filter-popup">
          <div className="filter-header">
            <h3>Filter Options</h3>
            <button className="close-btn" onClick={() => setShowFilters(false)}>
              ✖
            </button>
          </div>

          <div className="filter-options">
            <label>Price Range</label>
            <select value={price} onChange={(e) => setPrice(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="0-1000">Under ₹1000</option>
              <option value="1000-2000">₹1000 - ₹2000</option>
              <option value="2000-5000">₹2000 - ₹5000</option>
            </select>

            <label>Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="all">All Styles</option>
              <option value="solid">Solid</option>
              <option value="printed">Printed</option>
              <option value="striped">Striped</option>
              <option value="checked">Checked</option>
              <option value="denim">Denim</option>
              <option value="hoodie">Hoodie</option>
              <option value="track">Track</option>
            </select>

            <button className="apply-btn" onClick={handleFilter}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ✅ Overlay */}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* ✅ Product Grid */}
      <div className="boys-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="boys-card">
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button
                onClick={() => {
                  addToCart(p);
                  showCartPopup();
                }}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {/* ✅ Popup */}
      {popup && <div className="popup">🛒 Item added to cart!</div>}
    </section>
  );
};

export default BoysPage;
