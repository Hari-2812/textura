import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../styles/HeroBanner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../assets/images/polo1.jpg";
import img2 from "../assets/images/polo2.jpg";
import img3 from "../assets/images/polo3.jpg";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [showSelectPopup, setShowSelectPopup] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: false,
  };

  const slides = [
    {
      id: 1,
      image: img1,
      text: "Flat 50% Off on New Collection",
      link: "/offers",
    },
    { id: 2, image: img2, text: "Fresh Styles for Boys", link: "/boys" },
    { id: 3, image: img3, text: "Comfort Meets Fashion", link: "/girls" },
  ];

  return (
    <div className="hero-banner">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="hero-slide">
            <img src={slide.image} alt={slide.text} />
            <div className="hero-text">
              <h2>{slide.text}</h2>

              {/* Direct Navigate Based on Slide */}
              <button onClick={() => navigate(slide.link)}>Explore Now</button>
            </div>
          </div>
        ))}
      </Slider>

      {/* POPUP (New Part) */}
      {showSelectPopup && (
        <div
          className="hb-popup-overlay"
          onClick={() => setShowSelectPopup(false)}
        >
          <div className="hb-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Select Category</h3>

            <div className="hb-options">
              <button
                className="hb-option-btn"
                onClick={() => navigate("/boys")}
              >
                👦 Boys
              </button>

              <button
                className="hb-option-btn"
                onClick={() => navigate("/girls")}
              >
                👧 Girls
              </button>
            </div>

            <button
              className="hb-close-btn"
              onClick={() => setShowSelectPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
