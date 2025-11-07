import React from "react";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <h2>Subscribe to Our Newsletter</h2>
      <p>Get exclusive deals and updates.</p>
      <div className="newsletter-input">
        <input type="email" placeholder="Enter your email" />
        <button className="subscribe-btn">Subscribe</button>
      </div>
    </section>
  );
};

export default Newsletter;
