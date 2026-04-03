import React, { useEffect, useState } from "react";
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
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * 0.2);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    fade: true,
  };

  const slides = [
    {
      id: 1,
      image: img1,
      title: "Premium Drop for Everyday Kidswear",
      subtitle: "Crafted fits with soft textures, modern cuts, and all-day comfort.",
      link: "/boys",
    },
    {
      id: 2,
      image: img2,
      title: "Fresh Styles for Girls Collection",
      subtitle: "Elegant essentials with lightweight fabric and premium finish.",
      link: "/girls",
    },
    {
      id: 3,
      image: img3,
      title: "Seasonal Picks at Better Prices",
      subtitle: "Limited-time offers and new arrivals curated for your cart.",
      link: "/offers",
    },
  ];

  return (
    <section className="hero-banner" id="hero">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div className="hero-slide" key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-img"
              style={{ transform: `translateY(${offsetY}px)` }}
            />
            <div className="hero-overlay" />

            <div className="hero-content">
              <p>TEXTURA</p>
              <h1>{slide.title}</h1>
              <span>{slide.subtitle}</span>
              <button onClick={() => navigate(slide.link)}>Shop Collection</button>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroBanner;
