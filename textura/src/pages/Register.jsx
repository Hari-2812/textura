import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css";

// Firebase imports
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // ⭐ Toast state
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------------------
  // EMAIL + PASSWORD SIGNUP
  // ----------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Add display name
      await updateProfile(userCredential.user, {
        displayName: form.name,
      });

      const idToken = await userCredential.user.getIdToken();

      // Send token to backend
      const res = await axios.post("http://localhost:5000/api/users/login", {
        token: idToken,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ⭐ Replace alert with toast
      showToast("Registration successful 🎉");

      // Auto redirect
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      showToast(err.message || "Registration failed");
    }
  };

  // ----------------------------------------
  // GOOGLE SIGNUP
  // ----------------------------------------
  const handleGoogleSignup = async () => {
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

      showToast("Google signup successful 🎉");

      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      showToast(err.message);
    }

    setLoadingGoogle(false);
  };

  return (
    <div className="register-container">
      {/* ⭐ Toast message */}
      {toast && <div className="login-toast">{toast}</div>}

      <div className="register-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join Textura and enjoy the best styles!</p>

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
            placeholder="Email"
            required
            onChange={handleChange}
          />

          {/* Password + Eye Toggle */}
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

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="google-btn"
          disabled={loadingGoogle}
          style={{ opacity: loadingGoogle ? 0.6 : 1 }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="google-icon"
          />
          {loadingGoogle ? "Please wait..." : "Sign up with Google"}
        </button>

        <p className="redirect-text">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
