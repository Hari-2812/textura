import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";

// Firebase
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============================================================
        🔥 Handle Firebase Signup
  ============================================================ */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1️⃣ Create account in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2️⃣ Get Firebase ID Token
      const idToken = await userCredential.user.getIdToken();

      // 3️⃣ Send token + name to backend to store in MongoDB
      const res = await axios.post("http://localhost:5000/api/users/register", {
        token: idToken,
        name: form.name,
      });

      // 4️⃣ Save backend JWT + user profile
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="signup-container">
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button type="submit" className="signup-btn" disabled={loading}>
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
