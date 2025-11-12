// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = form;

    // ✅ Hardcoded admin credentials
    if (email === "admin@textura.com" && password === "admin123") {
      const adminUser = { name: "Admin", email, role: "admin" };
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid admin credentials ❌");
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
