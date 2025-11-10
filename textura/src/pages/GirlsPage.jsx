import React, { useState, useEffect } from "react";
import { girlsProducts } from "../data/girlsProducts";
import "../styles/GirlsPage.css";
import { useCart } from "../context/CartContext";

const GirlsPage = ({ showFilters, setShowFilters }) => {
  const [filteredProducts, setFilteredProducts] = useState(girlsProducts);
  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");
  const { addToCart } = useCart();
  const [popup, setPopup] = useState(false);

  // ✅ Filter Logic
  const handleFilter = () => {
    let filtered = [...girlsProducts];

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

  // ✅ Reset when closed
  useEffect(() => {
    if (!showFilters && filteredProducts.length === 0) {
      setFilteredProducts(girlsProducts);
    }
  }, [showFilters]);

  // ✅ Popup animation handler
  const showCartPopup = () => {
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
  };

  return (
    <section className="girls-page">
      <h2>Girls Collection</h2>

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
              <option value="floral">Floral</option>
              <option value="denim">Denim</option>
              <option value="traditional">Traditional</option>
              <option value="hoodie">Hoodie</option>
            </select>

            <button className="apply-btn" onClick={handleFilter}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* ✅ Product Grid */}
      <div className="girls-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="girls-card">
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

export default GirlsPage;
