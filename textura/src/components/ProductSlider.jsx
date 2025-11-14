import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ProductSlider.css";
import img1 from "../assets/images/polo1.jpg";
import img2 from "../assets/images/polo2.jpg";
import img3 from "../assets/images/polo3.jpg";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const NewArrival = () => {
  const { addToCart } = useCart();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3, // ✅ for desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // ✅ 2 cards for tablets
      { breakpoint: 768, settings: { slidesToShow: 2 } }, // ✅ 2 cards for mobile
    ],
  };

  const newArrivals = [
    { id: 1, image: img1, name: "Benetton Polo 1", price: "$29" },
    { id: 2, image: img2, name: "Benetton Polo 2", price: "$32" },
    { id: 3, image: img3, name: "Benetton Polo 3", price: "$30" },
    { id: 4, image: img1, name: "Benetton Polo 4", price: "$28" },
    { id: 5, image: img2, name: "Benetton Polo 5", price: "$31" },
  ];

  return (
    <section className="product-slider">
      <h2 className="slider-title">🆕 New Arrivals</h2>
      <Slider {...settings}>
        {newArrivals.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <button
              onClick={() => {
                addToCart(item);
                alert(`${item.name} added to cart 🛒`);
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
