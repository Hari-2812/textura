import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import ReCAPTCHA from "react-google-recaptcha";

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

  const [captchaToken, setCaptchaToken] = useState("");

  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================================
      NORMAL LOGIN
  ================================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken)
      return showToast("Please verify captcha first");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      if (!userCredential.user.emailVerified)
        return showToast("Please verify your email first");

      const idToken = await userCredential.user.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          token: idToken,
          captcha: captchaToken,
        }
      );

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Login successful 🎉");
      setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (err) {
      showToast(err.message || "Invalid login");
    }
  };

  /* ================================
      GOOGLE LOGIN
  ================================== */
  const handleGoogleLogin = async () => {
    if (!captchaToken)
      return showToast("Verify captcha first");

    if (loadingGoogle) return;
    setLoadingGoogle(true);

    try {
      const googleUser = await signInWithPopup(auth, googleProvider);
      const idToken = await googleUser.user.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          token: idToken,
          captcha: captchaToken,
        }
      );

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Google Login Successful 🎉");
      setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (err) {
      if (err.code !== "auth/cancelled-popup-request") {
        showToast(err.message);
      }
    }

    setLoadingGoogle(false);
  };

  /* ================================
      FORGOT PASSWORD
  ================================== */
  const handleForgotPassword = async () => {
    if (!form.email) return showToast("Enter your email first");

    try {
      await sendPasswordResetEmail(auth, form.email);
      showToast("Password reset link sent!");
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="login-container">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue shopping</p>

        <form onSubmit={handleLogin} className="login-form">
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
              {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
            </span>
          </div>

          <ReCAPTCHA
           sitekey={process.env.REACT_APP_RECAPTCHA_KEY}

            onChange={(value) => setCaptchaToken(value)}
          />

          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={loadingGoogle}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            className="google-icon"
            alt="Google"
          />
          {loadingGoogle ? "Please wait..." : "Login with Google"}
        </button>

        <p className="redirect-text">
          Don’t have an account?
          <span onClick={() => navigate("/signup")}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
