import React, { useState } from "react";
import "../styles/ContactPage.css";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all the fields before submitting!");
      return;
    }
    alert("✅ Message sent successfully! We’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <div className="contact-hero">
        <h1>Contact <span>Textura</span></h1>
        <p>We’re here to help you with all your queries and feedback!</p>
      </div>

      {/* Content Section */}
      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
            ></textarea>
            <button type="submit" className="send-btn">Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Our Office</h2>
          <p>📍 45, MG Road, Coimbatore, Tamil Nadu - 641001</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@textura.in</p>

          <h2>Business Hours</h2>
          <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
          <p>Sunday: Closed</p>

          <div className="map">
            <iframe
              title="Textura Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.468726481021!2d76.96697961480306!3d11.016844592156653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859b7f09c4e59%3A0x748907fcf282983a!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1679310200000!5m2!1sen!2sin"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
