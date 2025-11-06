import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../assets/images/polo1.jpg";
import img2 from "../assets/images/polo2.jpg";
import img3 from "../assets/images/polo3.jpg";

const ProductSlider = ({ title }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ],
  };

  const products = [
    { id: 1, image: img1, name: "Benetton Polo 1", price: "$29" },
    { id: 2, image: img2, name: "Benetton Polo 2", price: "$32" },
    { id: 3, image: img3, name: "Benetton Polo 3", price: "$30" },
    { id: 4, image: img1, name: "Benetton Polo 4", price: "$28" },
    { id: 5, image: img2, name: "Benetton Polo 5", price: "$31" },
  ];

  return (
    <section className="product-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;
