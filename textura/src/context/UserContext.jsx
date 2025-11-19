// 📁 src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Register a new customer
  const register = (newUser) => {
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const exists = registeredUsers.find((u) => u.email === newUser.email);
    if (exists) {
      return { success: false, message: "Email already registered." };
    }

    // default role = user
    const userWithRole = { ...newUser, role: "user" };
    registeredUsers.push(userWithRole);

    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    setUser(userWithRole);
    return { success: true };
  };

  // ✅ Login user (with admin support)
  const login = (email, password) => {
    // 🔐 Hardcoded admin login
    if (email === "admin@textura.com" && password === "admin123") {
      const adminUser = {
        name: "Admin",
        email,
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return { success: true };
    }

    // normal users
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const found = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      return { success: true };
    }

    return { success: false, message: "Invalid email or password." };
  };

  // ✅ Update user profile
  const updateUser = (updatedData) => {
    if (!user) return;

    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const updatedUsers = registeredUsers.map((u) =>
      u.email === user.email ? { ...u, ...updatedData } : u
    );

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // ✅ Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom hook
export const useUser = () => useContext(UserContext);
