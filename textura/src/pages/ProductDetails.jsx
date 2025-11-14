import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import "../styles/ProductDetails.css";
import { FaShoppingCart, FaPlay } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return <p className="loading">Product not found 😕</p>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart 👕");
      return;
    }
    addToCart({ ...product, size: selectedSize });
    alert(`${product.name} (${selectedSize}) added to cart 🛒`);
  };

  const handleTryNow = () => {
    alert(`🧥 Trying on: ${product.name} (${selectedSize || "Select a size"})`);
  };

  const sizes = ["S", "M", "L", "XL"];

  // ✅ Dynamically filter recommended products
  const recommended = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="product-details">
      <div className="product-details-container">
        {/* ✅ Left: Product Image */}
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>

        {/* ✅ Right: Product Info */}
        <div className="product-info-section">
          <h2>{product.name}</h2>
          <p className="price">{product.price}</p>

          {/* ✅ Size Selection */}
          <div className="size-selector">
            <p>Select Size:</p>
            <div className="sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Description */}
          <p className="desc">
            {product.description ||
              "Crafted with high-quality materials, this outfit ensures comfort and durability — designed to match your unique style!"}
          </p>

          {/* ✅ Buttons */}
          <div className="button-group">
            <button className="add-btn" onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="try-btn" onClick={handleTryNow}>
              <FaPlay /> Try Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Recommended Products */}
      {recommended.length > 0 && (
        <div className="recommended-section">
          <h3>🛍️ Recommended for You</h3>
          <div className="recommended-grid">
            {recommended.map((item) => (
              <div key={item.id} className="recommended-card">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <h4>{item.name}</h4>
                <p>{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="small-cart-btn"
                >
                  <FaShoppingCart /> Add to cartcd 
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
