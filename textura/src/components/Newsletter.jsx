// src/components/Newsletter.jsx
import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../styles/Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success | error | loading

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // ✉️ Send email using EmailJS
      await emailjs.send(
        "your_service_id",
        "your_template_id",
        { to_email: email },
        "your_public_key"
      );

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="newsletter">
      <h2>Subscribe to Our Newsletter</h2>
      <p>Get exclusive deals and updates.</p>

      <form onSubmit={handleSubscribe} className="newsletter-input">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p className="success-msg">
          🎉 Subscription successful! Check your inbox.
        </p>
      )}
      {status === "error" && (
        <p className="error-msg">
          ❌ Please enter a valid email or try again later.
        </p>
      )}
    </section>
  );
};

export default Newsletter;
