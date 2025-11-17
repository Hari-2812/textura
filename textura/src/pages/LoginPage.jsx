import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

// Firebase imports
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ Show/hide password

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------------
  // EMAIL + PASSWORD LOGIN
  // -------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const idToken = await userCredential.user.getIdToken();

      const res = await axios.post("http://localhost:5000/api/users/login", {
        token: idToken,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.message || "Invalid login");
    }
  };

  // -------------------------------
  // GOOGLE LOGIN
  // -------------------------------
  const handleGoogleLogin = async () => {
    if (loadingGoogle) return;

    setLoadingGoogle(true);

    try {
      const googleUser = await signInWithPopup(auth, googleProvider);
      const idToken = await googleUser.user.getIdToken();

      const res = await axios.post("http://localhost:5000/api/users/login", {
        token: idToken,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Google login successful!");
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/cancelled-popup-request") {
        alert(err.message);
      }
    }

    setLoadingGoogle(false);
  };

  // -------------------------------
  // FORGOT PASSWORD
  // -------------------------------
  const handleForgotPassword = async () => {
    if (!form.email) {
      alert("Enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue shopping</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* EMAIL FIELD */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          {/* PASSWORD FIELD + EYE TOGGLE */}
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
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* FORGOT PASSWORD LINK */}
          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={loadingGoogle}
          style={{ opacity: loadingGoogle ? 0.6 : 1 }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-icon"
          />
          {loadingGoogle ? "Please wait..." : "Login with Google"}
        </button>

        <p className="redirect-text">
          Don't have an account?
          <span onClick={() => navigate("/signup")}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
