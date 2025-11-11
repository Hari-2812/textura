import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const AdminTopbar = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-topbar">
      <h3>Admin Dashboard</h3>
      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt /> Logout
      </button>
    </header>
  );
};

export default AdminTopbar;
