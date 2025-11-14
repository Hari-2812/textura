import React, { useState, useEffect } from "react";
import "../styles/GirlsPage.css";
import "../styles/ProductFilters.css";
import { useCart } from "../context/CartContext";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const GirlsPage = ({ showFilters, setShowFilters }) => {
  const [girlsProducts, setGirlsProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");

  const { addToCart } = useCart();
  const [popup, setPopup] = useState(false);

  // ⭐ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data.products || [];

        // ⭐ Category "2" or "girls"
        const girls = allProducts.filter(
          (p) =>
            p.category === "2" ||
            p.category.toLowerCase() === "girls"
        );

        setGirlsProducts(girls);
        setFilteredProducts(girls);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ⭐ Filter Logic
  const handleFilter = () => {
    let filtered = [...girlsProducts];

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

  // ⭐ Reset when filters are closed
  useEffect(() => {
    if (!showFilters && filteredProducts.length === 0) {
      setFilteredProducts(girlsProducts);
    }
  }, [showFilters, girlsProducts, filteredProducts.length]);

  // ⭐ Add-to-cart popup
  const showCartPopup = () => {
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
  };

  return (
    <section className="girls-page">
      <h2>Girls Collection</h2>

      {/* ⭐ Filter Popup */}
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

      {/* ⭐ Overlay */}
      {showFilters && (
        <div className="overlay" onClick={() => setShowFilters(false)} />
      )}

      {/* ⭐ Product Grid */}
      <div className="girls-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={(item) => {
                addToCart(item);
                showCartPopup();
              }}
            />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {/* ⭐ Popup */}
      {popup && <div className="popup">🛒 Item added to cart!</div>}
    </section>
  );
};

export default GirlsPage;
