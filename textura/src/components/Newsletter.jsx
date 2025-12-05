// src/components/Newsletter.jsx
import React, { useState } from "react";
import "../styles/Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success | error | loading

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Remove ZERO-WIDTH characters + trim
    const cleanEmail = email.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

    console.log("Typed email:", email);
    console.log("Clean email:", cleanEmail);

    // Validate cleaned email
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(
        "https://textura-z80b.onrender.com/api/newsletter/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
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
        <p className="success-msg">🎉 Subscription successful!</p>
      )}
      {status === "error" && (
        <p className="error-msg">❌ Invalid email. Try again.</p>
      )}
    </section>
  );
};

export default Newsletter;
