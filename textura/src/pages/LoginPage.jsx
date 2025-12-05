import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ========================
      LOGIN
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const idToken = await userCred.user.getIdToken();

      const res = await axios.post("https://textura-z80b.onrender.com/api/users/login", {
        token: idToken,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Login successful 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast(err.message);
    }
  };

  /* ========================
      GOOGLE LOGIN
  ========================= */
  const handleGoogleLogin = async () => {
    if (loadingGoogle) return;
    setLoadingGoogle(true);

    try {
      const googleUser = await signInWithPopup(auth, googleProvider);
      const idToken = await googleUser.user.getIdToken();

      const res = await axios.post(
        "https://textura-z80b.onrender.com/api/users/login",
        { token: idToken }
      );

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Google Login Successful 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast(err.message);
    }

    setLoadingGoogle(false);
  };

  /* ========================
      FORGOT PASSWORD
  ========================= */
  const handleForgotPassword = async () => {
    if (!form.email) return showToast("Enter your email first");

    try {
      await sendPasswordResetEmail(auth, form.email);
      showToast("Reset email sent!");
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
        <p className="company-desc">
          Shop premium products with the best offers daily.
        </p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={handleLogin}>
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

            <p className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </p>

            <button className="login-btn">Login</button>
          </form>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              className="google-icon"
              alt=""
            />
            {loadingGoogle ? "Please wait..." : "Login with Google"}
          </button>

          <p className="redirect-text">
            Don’t have an account?
            <span onClick={() => navigate("/signup")}> Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
