import React from "react";
import { useUser } from "../context/UserContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
