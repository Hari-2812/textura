import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("userToken");

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    };

    loadUser();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
