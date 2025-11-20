import React from "react";
import "../styles/HelpCenter.css";   // ✅ CSS from styles folder

const HelpCenter = () => {
  return (
    <div className="help-wrapper">

      <h1 className="help-title">Help Center</h1>
      <p className="help-subtitle">
        We're here to assist you with anything related to Textura Garments.
      </p>

      {/* FAQ Section */}
      <section className="help-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>How can I track my order?</h3>
          <p>You will receive a tracking link via SMS/Email after your order is shipped.</p>
        </div>

        <div className="faq-item">
          <h3>What is the return policy?</h3>
          <p>Returns accepted within 7 days if unused with original tags.</p>
        </div>

        <div className="faq-item">
          <h3>How long does delivery take?</h3>
          <p>Usually 3–7 business days based on location.</p>
        </div>
      </section>

      {/* Orders Section */}
      <section className="help-section">
        <h2>Orders & Shipping</h2>
        <p>• Order packing within 24 hours.</p>
        <p>• Free delivery on selected items.</p>
        <p>• Delivery address can be updated before shipping.</p>
      </section>

      {/* Payments */}
      <section className="help-section">
        <h2>Payments</h2>
        <p>• UPI, Cards, Net banking & Wallets supported.</p>
        <p>• Cash on delivery available in selected regions.</p>
      </section>

      {/* Contact */}
      <section className="help-section">
        <h2>Contact Support</h2>
        <p>📧 Email: <strong>Textura0511@gmail.com</strong></p>
        <p>📱 WhatsApp: <strong>+919361876698</strong></p>

        <a
          href="https://wa.me/9361876698?text=Hello%20Textura%20Support%2C%20I%20need%20help"
          target="_blank"
          rel="noreferrer"
          className="help-whatsapp-btn"
        >
          Chat on WhatsApp
        </a>
      </section>
    </div>
  );
};

export default HelpCenter;
