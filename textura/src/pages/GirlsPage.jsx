import React, { useMemo, useState } from "react";
import "../styles/GirlsPage.css";
import "../styles/ProductFilters.css";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import useProductsByCategory from "../hooks/useProductsByCategory";
import ProductCollectionState, {
  ProductGridSkeleton,
} from "../components/common/ProductCollectionState";

const GirlsPage = ({ showFilters, setShowFilters }) => {
  const { addToCart } = useCart();
  const { products, loading, error } = useProductsByCategory("girls");

  const [price, setPrice] = useState("all");
  const [style, setStyle] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const priceValue = Number(product.price) || 0;
      const description = (product.description || "").toLowerCase();

      const priceMatch =
        price === "all" ||
        (() => {
          const [min, max] = price.split("-").map(Number);
          return priceValue >= min && priceValue <= max;
        })();

      const styleMatch = style === "all" || description.includes(style.toLowerCase());

      return priceMatch && styleMatch;
    });
  }, [products, price, style]);

  return (
    <section className="collection-page girls-page">
      <h2>Girls Collection</h2>

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

            <button className="apply-btn" onClick={() => setShowFilters(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {showFilters && <div className="overlay" onClick={() => setShowFilters(false)} />}

      <div className="collection-grid">
        {loading && <ProductGridSkeleton />}

        {!loading && error && (
          <ProductCollectionState
            title="Couldn’t load products"
            description={error}
            actionLabel="Refresh"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <ProductCollectionState
            title="No products found"
            description="Try changing filter options or come back later for fresh arrivals."
          />
        )}

        {!loading && !error &&
          filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={(item) => {
                addToCart(item);
                toast.success("🛒 Item added to cart!");
              }}
            />
          ))}
      </div>
    </section>
  );
};

export default GirlsPage;
