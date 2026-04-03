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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(buildApiUrl("/users/login"), {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful 🎉");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to continue shopping</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <label className="field-group">
            <FiMail className="auth-input-icon" />
            <input type="email" name="email" required onChange={handleChange} value={form.email} placeholder=" " />
            <span>Email Address</span>
          </label>

          <label className="field-group">
            <FiLock className="auth-input-icon" />
            <input type={showPassword ? "text" : "password"} name="password" required onChange={handleChange} value={form.password} placeholder=" " />
            <span>Password</span>
            <button type="button" className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </label>

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
