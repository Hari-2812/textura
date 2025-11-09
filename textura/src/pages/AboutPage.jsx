import React from "react";
import "../styles/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1600&q=80"
          alt="About Textura"
        />
        <div className="overlay"></div>
        <h1>About <span>Textura</span></h1>
      </div>

      <div className="about-content">
        <h2>Our Story</h2>
        <p>
          Welcome to <strong>Textura</strong> — your trusted online destination
          for high-quality garments and fashion essentials. We started with a
          simple mission: to bring style, comfort, and confidence to every
          individual through our thoughtfully designed apparel collections.
        </p>

        <h2>Our Vision</h2>
        <p>
          At Textura, we believe that fashion should be accessible to everyone.
          Our vision is to combine elegance with affordability — offering
          stylish outfits that reflect your personality without compromising on
          comfort or quality.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>✔ Premium-quality fabrics and latest trends</li>
          <li>✔ 100% customer satisfaction guarantee</li>
          <li>✔ Fast and safe delivery across India</li>
          <li>✔ Secure payments and easy returns</li>
        </ul>

        <h2>Our Promise</h2>
        <p>
          Every outfit you wear tells a story — and we’re here to make it a
          memorable one. Whether it’s casual wear, festive outfits, or kids’
          fashion, Textura stands for trust, comfort, and timeless elegance.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
