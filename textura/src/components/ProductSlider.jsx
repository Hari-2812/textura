import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductSlider.css";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import products from "../data/products"; // ✅ Use shared data file

const NewArrival = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  return (
    <section className="product-slider">
      <h2 className="slider-title">🆕 New Arrivals</h2>
      <Slider {...settings}>
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img
              src={item.image}
              alt={item.name}
              className="product-image"
              onClick={() => handleProductClick(item)}
              style={{ cursor: "pointer" }}
            />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button
              className="add-cart-btn"
              onClick={() => {
                addToCart(item);
                alert(`${item.name} added to cart 🛒`);
              }}
            >
              <FaShoppingCart style={{ marginRight: "6px" }} />
              Add to Cart
            </button>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default NewArrival;
