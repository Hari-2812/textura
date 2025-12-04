import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductSlider.css";
import img1 from "../assets/images/polo1.jpg";
import img2 from "../assets/images/polo2.jpg";
import img3 from "../assets/images/polo3.jpg";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NewArrival = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
  const box = document.getElementById("toast-container");
  const div = document.createElement("div");

  div.className = "toast";
  div.innerText = msg;
  box.appendChild(div);

  setTimeout(() => div.remove(), 2000);
};

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3, // DESKTOP
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,

    responsive: [
      {
        breakpoint: 1024, // Tablets / small laptops
        settings: {
          slidesToShow: 2, // Show 2 slides
        },
      },
      {
        breakpoint: 768, // Mobile screens
        settings: {
          slidesToShow: 2, // Still 2 slides
        },
      },
      {
        breakpoint: 480, // Very small screens
        settings: {
          slidesToShow: 1, // Optional: 1 slide for tiny screens
        },
      },
    ],
  };

  const newArrivals = [
    { id: "6744aa11c9d1", image: img1, name: "Benetton Polo 1", price: 29 },
    { id: "6744ab22d112", image: img2, name: "Benetton Polo 2", price: 32 },
    { id: "6744ac33b882", image: img3, name: "Benetton Polo 3", price: 30 },
    { id: "6744ad44cc12", image: img1, name: "Benetton Polo 4", price: 28 },
    { id: "6744ae55dd21", image: img2, name: "Benetton Polo 5", price: 31 },
  ];

  return (
    <section className="product-slider">

      <h2 className="slider-title"> New Arrivals</h2>

      <Slider {...settings}>
        {newArrivals.map((item) => (
          <div key={item.id} className="product-card">
            {/* CLICK TO OPEN PRODUCT DETAILS */}
            <div
              className="slider-click-area"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={() => {
                addToCart(item);
                showToast(`${item.name} added to cart 🛒`);
              }}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default NewArrival;
