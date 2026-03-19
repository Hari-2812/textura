import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ProductDetails.css";
import axios from "axios";
import { buildApiUrl } from "../api";
import { FaShoppingCart, FaPlay } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import SizeGuideModal from "../components/SizeGuideModal";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  // ⭐ Toast + Inline Error
  const [sizeError, setSizeError] = useState("");
  const [toast, setToast] = useState("");

  // ⭐ Try Room Popup (simple)
  const [showTryPopup, setShowTryPopup] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(buildApiUrl(`/products/${id}`));
        const p = res.data.product;
        setProduct(p);

        const all = await axios.get(buildApiUrl("/products"));
        const rec = all.data.products
          .filter((item) => item.category === p.category && item._id !== p._id)
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

  // Size Guide
  const heightGuide = {
    "2-3Y": "92–98 cm",
    "3-4Y": "98–104 cm",
    "4-5Y": "104–110 cm",
    "5-6Y": "110–116 cm",
    "6-7Y": "116–122 cm",
    "7-8Y": "122–128 cm",
    "9-10Y": "134–140 cm",
    "11-12Y": "146–152 cm",
    "13-14Y": "158–164 cm",
    "14-15Y": "164–170 cm",
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("⚠️ Please select a size before adding to cart.");
      return;
    }

    setSizeError("");

    addToCart({ ...product, size: selectedSize });

    showToast(`${product.name} (${selectedSize}) added to cart 🛒`);
  };

  return (
    <>
      {/* ⭐ Global Toast */}
      {toast && <div className="cart-toast">{toast}</div>}

      <div className="product-details">
        <div className="product-details-container">

          {/* Left Image */}
          <div className="product-image-section">
            <img src={product.images?.[0]?.url} alt={product.name} />
          </div>

          {/* Right Info */}
          <div className="product-info-section">
            <h2>{product.name}</h2>
            <p className="price">₹{product.price}</p>

            {/* SIZE SELECTOR */}
            <div className="size-selector">
              <p>Select Size:</p>

              <div className="size-grid">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((s) => (
                    <div
                      key={s.label}
                      className={`size-box 
                        ${selectedSize === s.label ? "active" : ""} 
                        ${s.stock === 0 ? "disabled" : ""}`}
                      onClick={() => s.stock !== 0 && setSelectedSize(s.label)}
                    >
                      {s.label}
                    </div>
                  ))
                ) : (
                  <p>No sizes available</p>
                )}
              </div>

              {/* INLINE ERROR */}
              {sizeError && <div className="size-error-box">{sizeError}</div>}

              {/* Height Guide */}
              {selectedSize && (
                <p className="height-guide">
                  Height: {heightGuide[selectedSize]}
                </p>
              )}

              <button
                className="size-guide-btn"
                onClick={() => setShowGuide(true)}
              >
                View Size Guide
              </button>
            </div>

            <p className="desc">
              {product.description ||
                "Crafted with high-quality materials, this outfit ensures comfort and durability — designed to match your unique style!"}
            </p>

            <div className="button-group">
              <button className="add-btn" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>

              {/* ⭐ NEW: Try Now opens popup */}
              <button className="try-btn" onClick={() => setShowTryPopup(true)}>
                <FaPlay /> Try Now
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <div className="recommended-section">
            <h3>🛍️ Recommended for You</h3>
            <div className="recommended-grid">
              {recommended.map((item) => (
                <div key={item._id} className="recommended-card">
                  <Link to={`/product/${item._id}`}>
                    <img src={item.images?.[0]?.url} alt={item.name} />
                  </Link>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <button
                    onClick={() => {
                      addToCart(item);
                      showToast(`${item.name} added to cart 🛒`);
                    }}
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

      {/* ⭐ POPUP FOR TRY-ON COMING SOON */}
      {showTryPopup && (
        <div className="try-popup-overlay">
          <div className="try-popup-box">
            <h2>👗 Virtual Try-On</h2>
            <p>This feature is coming soon! Stay tuned 😊</p>

            <button
              className="close-popup-btn"
              onClick={() => setShowTryPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Size Guide */}
      {showGuide && <SizeGuideModal onClose={() => setShowGuide(false)} />}
    </>
  );
};

export default ProductDetails;
