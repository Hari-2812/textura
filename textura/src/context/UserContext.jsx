// 📁 src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 🧠 Load user from localStorage on startup
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Save user to localStorage whenever updated
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Register new user
  const register = (newUser) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const exists = registeredUsers.find((u) => u.email === newUser.email);

    if (exists) {
      return { success: false, message: "Email already registered." };
    }

    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    setUser(newUser); // Auto login after signup
    return { success: true };
  };

  // ✅ Login existing user
  const login = (email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const found = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      return { success: true };
    }

    return { success: false, message: "Invalid email or password." };
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
