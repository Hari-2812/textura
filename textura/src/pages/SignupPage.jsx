import React, { useState } from "react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../api";
import toast from "react-hot-toast";

import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);

    try {
      await axios.post(buildApiUrl("/users/register"), {
        name: form.email.split("@")[0],
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join Textura and shop smarter</p>

        <form onSubmit={handleSignup} className="auth-form">
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

          <div className="auth-input-wrap">
            <FiLock className="auth-input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              value={form.confirmPassword}
            />
          </div>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="redirect-text">
          Already have an account?
          <button type="button" onClick={() => navigate("/login")}> Login</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
