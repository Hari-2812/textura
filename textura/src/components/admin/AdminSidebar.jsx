import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaCreditCard, FaTruck } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Orders", path: "/admin/orders", icon: <FaBox /> },
    { name: "Payments", path: "/admin/payments", icon: <FaCreditCard /> },
    { name: "Track Orders", path: "/admin/track", icon: <FaTruck /> },
  ];

  return (
    <aside className="admin-sidebar">
      <h2 className="logo">🧵 Garment Admin</h2>
      <nav>
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.icon} <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
