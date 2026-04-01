import React, { useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ========================
      LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(buildApiUrl("/users/login"), {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Login successful 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="login-left">
        <img src="/images/company.jpg" className="company-image" alt="Textura storefront" />
        <h1 className="company-title">Textura Shopping</h1>
        <p className="company-desc">
          Shop premium products with the best offers daily.
        </p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <p className="forgot-password">Use your registered account password.</p>

            <button className="login-btn">Login</button>
          </form>

          <p className="redirect-text">
            Don’t have an account?
            <button type="button" onClick={() => navigate("/signup")}> Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
