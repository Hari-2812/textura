import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
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
    if (loading) return;

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const idToken = await userCredential.user.getIdToken();

      const res = await axios.post("http://localhost:5000/api/users/register", {
        token: idToken,
        name: form.name,
      });

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("Account created successfully 🎉");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="signup-container">
      {toast && <div className="login-toast">{toast}</div>}

      <div className="signup-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join Textura — Style starts here!</p>

        <form onSubmit={handleSignup} className="signup-form">
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

          {/* Password + Icon */}
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

          <button className="signup-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="redirect-text">
          Already have an account?
          <span onClick={() => navigate("/login")}> Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
