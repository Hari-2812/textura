import React, { useState, useEffect } from "react";
import "../styles/BoysPage.css";
import "../styles/ProductFilters.css";
import { useCart } from "../context/CartContext";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const BoysPage = ({ showFilters, setShowFilters }) => {
  const [boysProducts, setBoysProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");

  const { addToCart } = useCart();

  // ⭐ Toast state
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ⭐ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://textura-z80b.onrender.com/api/products");
        const allProducts = res.data.products || [];

        const boys = allProducts.filter(
          (p) => p.category === "1" || p.category.toLowerCase() === "boys"
        );

        setBoysProducts(boys);
        setFilteredProducts(boys);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ⭐ Filter Logic
  const handleFilter = () => {
    let filtered = [...boysProducts];

    if (price !== "all") {
      const [min, max] = price.split("-");
      filtered = filtered.filter((p) => {
        const pr = parseInt(p.price);
        return pr >= parseInt(min) && pr <= parseInt(max);
      });
    }

    if (style !== "all") {
      filtered = filtered.filter((p) =>
        p.description?.toLowerCase().includes(style.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setShowFilters(false);
  };

  return (
    <section className="boys-page">
      {/* ⭐ Toast UI */}
      {toast && <div className="login-toast">{toast}</div>}

      <h2>Boys Collection</h2>

      {/* Filter Popup */}
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

      {/* Overlay */}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* ⭐ Product Grid */}
      <div className="boys-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={(item) => {
                addToCart(item);
                showToast("🛒 Item added to cart!");
              }}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </section>
  );
};

export default BoysPage;
