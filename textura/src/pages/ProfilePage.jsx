import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { user, updateUser, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* 👤 Header Section */}
        <div className="profile-header">
          <img
            src={
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="User Avatar"
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>{user?.name || "Guest User"}</h2>
            <p>{user?.email || "No email available"}</p>
          </div>
        </div>

        {/* 🔽 Main Details or Edit Section */}
        {!isEditing ? (
          <>
            <div className="profile-details">
              <p>
                <strong>Phone:</strong> {user?.phone || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong> {user?.address || "Not provided"}
              </p>
            </div>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
            <button className="logout-btn" onClick={logout}>
              🚪 Logout
            </button>
          </>
        ) : (
          <div className="edit-section">
            <input
              type="text"
              name="name"
              value={editedUser.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <input
              type="email"
              name="email"
              value={editedUser.email || ""}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <input
              type="text"
              name="phone"
              value={editedUser.phone || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            <input
              type="text"
              name="address"
              value={editedUser.address || ""}
              onChange={handleChange}
              placeholder="Enter your address"
            />

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
