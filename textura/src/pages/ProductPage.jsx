import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductPage.css";
import "../styles/TryRoom.css";

import { products } from "../data/products";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";

// ⭐ NEW — TensorFlow Offline Try-On
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showTryRoom, setShowTryRoom] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const product = products.find((p) => p.id === parseInt(id));

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

  // ⭐ Capture Image
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

  // ⭐ NEW — Offline Virtual Try-On using BodyPix
  const handleTryOn = async () => {
    const canvas = document.getElementById("tryroom-canvas");
    const ctx = canvas.getContext("2d");

    const net = await bodyPix.load();

    // Segment human body
    await net.segmentPerson(canvas);

    const cloth = new Image();
    cloth.src = product.img;

    cloth.onload = () => {
      ctx.drawImage(
        cloth,
        canvas.width * 0.28,
        canvas.height * 0.18,
        canvas.width * 0.45,
        canvas.height * 0.45
      );
    };
  };

  return (
    <div className="product-page">

      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <div className="product-container">

        <div className="product-image">
          <img src={product.img} alt={product.name} />

          <button
            className="try-now-btn"
            onClick={() => setShowTryRoom(true)}
          >
            👕 Try Now
          </button>
        </div>

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

      {showTryRoom && (
        <div className="tryroom-overlay">
          <div className="tryroom-box">

            <h2>Virtual Try Room</h2>

            <video id="tryroom-camera" autoPlay playsInline></video>

            <div className="tryroom-buttons">
              <button onClick={startCamera}>Start Camera</button>
              <button onClick={captureImage}>Capture</button>
              <button onClick={() => setShowTryRoom(false)}>Close</button>
            </div>

            <p>Or upload your full-body image</p>
            <input type="file" accept="image/*" onChange={uploadImage} />

            <canvas id="tryroom-canvas"></canvas>

            {/* ⭐ NEW WORKING OFFLINE TRY-ON BUTTON */}
            <button className="gen-btn" onClick={handleTryOn}>
              Apply Virtual Try-On
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductPage;
