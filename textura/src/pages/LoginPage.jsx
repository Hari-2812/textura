import React, { useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import toast from "react-hot-toast";

import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ========================
      LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await axios.post(buildApiUrl("/users/login"), {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue shopping</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-wrap">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              value={form.email}
            />
          </div>

          <div className="auth-input-wrap">
            <FiLock className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              value={form.password}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <button className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="redirect-text">
          Don’t have an account?
          <button type="button" onClick={() => navigate("/signup")}> Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
