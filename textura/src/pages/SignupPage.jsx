import React, { useState } from "react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../api";

import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword)
      return showToast("Passwords do not match");

    try {
      await axios.post(buildApiUrl("/users/register"), {
        name: form.email.split("@")[0],
        email: form.email,
        password: form.password,
      });
      showToast("Account created! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-wrapper">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="login-left">
        <img src="/images/company.jpg" className="company-image" alt="Textura storefront" />
        <h1 className="company-title">Textura Shopping</h1>
        <p className="company-desc">Create your account and start shopping.</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="subtitle">Join Textura Today</p>

          <form onSubmit={handleSignup}>
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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
            />

            <button className="login-btn" type="submit">
              Sign Up
            </button>
          </form>

          <p className="redirect-text">
            Already have an account?
            <button type="button" onClick={() => navigate("/login")}> Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
