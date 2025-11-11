import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({ name: "", password: "" });
  const [focusedInput, setFocusedInput] = useState(""); // track which field is active
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name === "" || form.password === "") {
      setError("Please fill in both fields!");
      return;
    }
    setError("");
    login(form.name, form.password);
    navigate("/");
  };

  return (
    <div className="auth-wrapper">
      {/* 👦 Animated Kid Section */}
      <div className="kid-section">
        <div className="kid-container">
          <img src="/images/kid-base.png" alt="Kid" className="kid-base" />
          <img
            src="/images/kid-eyes.png"
            alt="Eyes"
            className={`kid-eyes ${focusedInput === "name" ? "look-name" : ""} ${
              focusedInput === "password" ? "hide" : ""
            }`}
          />
          <img
            src="/images/kid-eyes-closed.png"
            alt="Closed Eyes"
            className={`kid-eyes-closed ${
              focusedInput === "password" ? "show" : ""
            }`}
          />
        </div>
      </div>

      {/* 🔐 Login Form Section */}
      <div className="login-section">
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <p className="subtitle">Please log in to continue</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput("")}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput("")}
            />
            <button type="submit">Login</button>
          </form>

          <p className="redirect-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
