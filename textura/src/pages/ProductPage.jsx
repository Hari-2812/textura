import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductPage.css";
import "../styles/TryRoom.css"; // <-- NEW: styles for modal
import { products } from "../data/products";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import axios from "axios"; // <-- NEW

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showTryRoom, setShowTryRoom] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // Find the product by ID
  const product = products.find((p) => p.id === parseInt(id));

  // If invalid ID
  if (!product) {
    return (
      <div className="product-not-found">
        <p>Product not found 😕</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // ⭐ Start Camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("tryroom-camera").srcObject = stream;
  };

  // ⭐ Capture user image
  const captureImage = () => {
    const video = document.getElementById("tryroom-camera");
    const canvas = document.getElementById("tryroom-canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
  };

  // ⭐ Upload Image
  const uploadImage = (event) => {
    const file = event.target.files[0];
    const canvas = document.getElementById("tryroom-canvas");
    const ctx = canvas.getContext("2d");

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ⭐ Generate AI Try-On (calls backend)
  const generateTryOn = async () => {
    const canvas = document.getElementById("tryroom-canvas");
    const userBase64 = canvas.toDataURL("image/png");

    try {
      const response = await axios.post("https://textura-z80b.onrender.com/api/tryon/generate", {
        userImage: userBase64,
        clothImage: product.img, // product image for try-on
      });

      setGeneratedImage(response.data.result);
    } catch (err) {
      alert("Try-on failed! Backend not connected.");
    }
  };

  return (
    <div className="product-page">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Product Section */}
      <div className="product-container">

        {/* Left: Image */}
        <div className="product-image">
          <img src={product.img} alt={product.name} />

          {/* ⭐ NEW Try Now Button */}
          <button 
            className="try-now-btn"
            onClick={() => setShowTryRoom(true)}
          >
            👕 Try Now
          </button>
        </div>

        {/* Right: Details */}
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-price">{product.price}</p>

          <p className="product-desc">
            This premium {product.name} is crafted from soft, durable cotton
            fabric. Perfect for everyday wear — combining comfort, style, and
            breathability. Available in multiple sizes and colors.
          </p>

          <div className="product-actions">
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="wishlist-btn">
              <FaHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ Virtual Try Room Modal */}
      {showTryRoom && (
        <div className="tryroom-overlay">
          <div className="tryroom-box">

            <h2>Virtual Try Room</h2>

            {/* Live Camera View */}
            <video id="tryroom-camera" autoPlay playsInline></video>

            <div className="tryroom-buttons">
              <button onClick={startCamera}>Start Camera</button>
              <button onClick={captureImage}>Capture</button>
              <button onClick={() => setShowTryRoom(false)}>Close</button>
            </div>

            {/* Upload instead of camera */}
            <p>Or upload your full-body image</p>
            <input type="file" accept="image/*" onChange={uploadImage} />

            {/* Canvas Image */}
            <canvas id="tryroom-canvas"></canvas>

            {/* Generate AI Try-On */}
            <button className="gen-btn" onClick={generateTryOn}>
              Generate Virtual Try-On
            </button>

            {/* Show Final AI Result */}
            {generatedImage && (
              <img src={generatedImage} alt="Try On Result" className="tryon-result" />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductPage;
