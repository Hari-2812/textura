import React, { useState } from "react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword)
      return showToast("Passwords do not match");

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await sendEmailVerification(userCred.user);

      const idToken = await userCred.user.getIdToken();

      showToast("Account created! Verify email before login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="login-left">
        <img src="/images/company.jpg" className="company-image" alt="" />
        <h1 className="company-title">Textura Shopping</h1>
        <p className="company-desc">Create your account and start shopping.</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="subtitle">Join Textura Today</p>

          <form onSubmit={handleSignup}>
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
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </span>
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
            />

            <button className="login-btn" type="submit">
              Sign Up
            </button>
          </form>

          <p className="redirect-text">
            Already have an account?
            <span onClick={() => navigate("/login")}> Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
