import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ProductDetails.css";
import axios from "axios";
import { FaShoppingCart, FaPlay } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  // ⭐ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        const p = res.data.product;
        setProduct(p);

        // ⭐ Fetch recommended products (same category)
        const all = await axios.get("http://localhost:5000/api/products");
        const rec = all.data.products
          .filter(
            (item) =>
              item.category === p.category &&
              item._id !== p._id
          )
          .slice(0, 4);

        setRecommended(rec);

      } catch (error) {
        console.log("Product fetch error:", error);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

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

  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];

  return (
    <div className="product-details">
      <div className="product-details-container">
        {/* ⭐ Left: Product Image */}
        <div className="product-image-section">
          <img 
            src={product.images?.[0]?.url} 
            alt={product.name} 
          />
        </div>

        {/* ⭐ Right: Product Info */}
        <div className="product-info-section">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price}</p>

          {/* ⭐ Size Selection */}
          <div className="size-selector">
            <p>Select Size:</p>
            <div className="sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ⭐ Description */}
          <p className="desc">
            {product.description ||
              "Crafted with high-quality materials, this outfit ensures comfort and durability — designed to match your unique style!"}
          </p>

          {/* ⭐ Buttons */}
          <div className="button-group">
            <button className="add-btn" onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="try-btn" onClick={() => alert("Try feature demo")}>
              <FaPlay /> Try Now
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ Recommended Products */}
      {recommended.length > 0 && (
        <div className="recommended-section">
          <h3>🛍️ Recommended for You</h3>
          <div className="recommended-grid">
            {recommended.map((item) => (
              <div key={item._id} className="recommended-card">
                <Link to={`/product/${item._id}`}>
                  <img 
                    src={item.images?.[0]?.url} 
                    alt={item.name}
                  />
                </Link>
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="small-cart-btn"
                >
                  <FaShoppingCart /> Add to Cart
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
