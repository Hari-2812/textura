import React from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// ✅ Import Admin Pages
import AdminDashboard from "./AdminDashboard";
import OrdersPage from "./OrdersPage";
import TrackOrdersPage from "./TrackOrdersPage";

import "../../styles/AdminLayout.css";

const AdminLayout = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate();

  // 🧠 Protect Admin Routes (only admin can access)
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  const handleLogout = () => {
    logout();
    alert("Admin logged out successfully!");
    navigate("/admin-login");
  };

  return (
    <div className="admin-layout">
      {/* 🧭 Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Textura</h2>
          <p>Admin Panel</p>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            📦 Orders
          </NavLink>

          <NavLink
            to="/admin/track"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            🚚 Track Orders
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* 📄 Main Section */}
      <main className="admin-main">
        <Routes>
          {/* Redirect default route */}
          <Route path="/" element={<Navigate to="dashboard" />} />

          {/* All Admin Sub-Pages */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="track" element={<TrackOrdersPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
