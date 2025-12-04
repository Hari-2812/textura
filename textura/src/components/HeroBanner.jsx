import React from "react";
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

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    fade: true,
  };

  const slides = [
    {
      id: 1,
      image: img1,
      title: "New Kids Collection",
      subtitle: "Minimal • Comfortable • Stylish",
      link: "/boys",
    },
    {
      id: 2,
      image: img2,
      title: "Daily Wear Essentials",
      subtitle: "Soft and breathable outfits for kids",
      link: "/girls",
    },
    {
      id: 3,
      image: img3,
      title: "Trending This Season",
      subtitle: "Fresh arrivals for boys & girls",
      link: "/offers",
    },
  ];

  return (
    <div className="minimal-hero-banner">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div className="minimal-hero-slide" key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              className="minimal-hero-img"
            />

            <div className="minimal-hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>

              <button onClick={() => navigate(slide.link)}>Shop Now</button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroBanner;
