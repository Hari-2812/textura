import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔄 Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in both fields!");
      return;
    }

    const result = login(form.email, form.password);

    if (result.success) {
      setError("");
      navigate("/"); // ✅ Redirect to home only after successful login
    } else {
      setError(result.message);
    }
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
            className={`kid-eyes ${focusedInput === "email" ? "look-name" : ""} ${
              focusedInput === "password" ? "hide" : ""
            } ${showPassword ? "peek" : ""}`}
          />
          <img
            src="/images/kid-eyes-closed.png"
            alt="Closed Eyes"
            className={`kid-eyes-closed ${
              focusedInput === "password" && !showPassword ? "show" : ""
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
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput("")}
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput("")}
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

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
