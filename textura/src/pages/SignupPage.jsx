import React, { useState } from "react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../api";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
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
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join Textura and shop smarter</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <label className="field-group">
            <FiMail className="auth-input-icon" />
            <input type="email" name="email" required onChange={handleChange} value={form.email} placeholder=" " />
            <span>Email Address</span>
          </label>

          <label className="field-group">
            <FiLock className="auth-input-icon" />
            <input type={showPassword ? "text" : "password"} name="password" required onChange={handleChange} value={form.password} placeholder=" " />
            <span>Password</span>
            <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEye /> : <FiEyeOff />}</button>
          </label>

          <label className="field-group">
            <FiLock className="auth-input-icon" />
            <input type="password" name="confirmPassword" required onChange={handleChange} value={form.confirmPassword} placeholder=" " />
            <span>Confirm Password</span>
          </label>

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
