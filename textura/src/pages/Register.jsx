import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css";

import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await sendEmailVerification(auth.currentUser);

      await updateProfile(userCredential.user, {
        displayName: form.name,
      });

      const idToken = await userCredential.user.getIdToken();

      await axios.post(
        "https://textura-z80b.onrender.com/api/users/register",
        {
          token: idToken,
          name: form.name,
        },
        { withCredentials: true }
      );

      showToast("Verify email before login!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="register-container">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="register-box">
        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
