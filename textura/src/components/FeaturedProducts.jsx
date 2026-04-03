import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import useProductsByCategory from "../hooks/useProductsByCategory";
import { useCart } from "../context/CartContext";
import ProductCollectionState, { ProductGridSkeleton } from "./common/ProductCollectionState";
import "../styles/FeaturedProducts.css";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const boys = useProductsByCategory("boys");
  const girls = useProductsByCategory("girls");

  const items = [...boys.products, ...girls.products]
    .filter((item) => item.isFeatured)
    .slice(0, 8);

  const fallback = [...boys.products, ...girls.products].slice(0, 8);
  const products = items.length ? items : fallback;
  const loading = boys.loading || girls.loading;
  const error = boys.error && girls.error ? boys.error : "";

  return (
    <section className="featured-products" id="featured-products">
      <div className="featured-head">
        <p>Trending Picks</p>
        <h2>Featured Products</h2>
        <button type="button" onClick={() => navigate("/offers")}>Explore all offers</button>
      </div>

      {loading && <ProductGridSkeleton />}
      {!loading && error && (
        <ProductCollectionState title="Could not load featured products" description={error} />
      )}
      {!loading && !error && !products.length && (
        <ProductCollectionState
          title="No featured products yet"
          description="Please check back soon. We are updating this section frequently."
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="featured-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
