// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { buildApiUrl } from "../api";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || "";
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(buildApiUrl("/users/login"), form);
      if (!data?.user?.isAdmin) {
        setError("Access denied: admin account required");
        return;
      }
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("user", JSON.stringify({ ...data.user, role: "admin" }));
      setUser({ ...data.user, role: "admin" });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials ❌");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p style={{ color: "#e63946" }}>{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
